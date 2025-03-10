import { Groq } from 'groq-sdk';
import * as cheerio from 'cheerio';
import puppeteer from 'puppeteer';
import { NextResponse } from 'next/server';
import axios from 'axios';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

async function fetchCSS(cssUrl) {
  try {
    const response = await axios.get(cssUrl);
    return response.data;
  } catch (error) {
    console.error("Error fetching CSS:", error);
    return null;
  }
}

export async function POST(request) {
  try {
    const { url } = await request.json();

    // Launch Puppeteer
    const browser = await puppeteer.launch({
      headless: 'new',
    });
    const page = await browser.newPage();
    await page.goto(url);
    
    // Get the page content
    const content = await page.content();

    // Extract CSS links from <link> or <style> tags
    const cssLinks = await page.$$eval('link[rel="stylesheet"], style', (links) =>
      links.map(link => {
        if (link.tagName.toLowerCase() === 'link') {
          return link.href;
        } else {
          return link.innerHTML;
        }
      })
    );

    await browser.close();

    // Parse the HTML with Cheerio
    const $ = cheerio.load(content);
    
    // Extract HTML content
    const title = $('title').text();
    const metaDescription = $('meta[name="description"]').attr('content') || '';
    const headings = $('h1, h2, h3').map((_, el) => $(el).text()).get();
    const paragraphs = $('p').map((_, el) => $(el).text()).get();
    const links = $('a').map((_, el) => $(el).text()).get();
    const images = $('img').map((_, el) => $(el).attr('alt')).get();
    const lists = $('ul, ol').map((_, el) => $(el).text()).get();

    // Scrape and fetch CSS files
    let cssContent = '';
    for (const cssLink of cssLinks) {
      if (cssLink.startsWith('http')) {
        const cssData = await fetchCSS(cssLink);
        if (cssData) {
          cssContent += cssData; // Append external CSS content
        }
      } else {
        cssContent += cssLink; // Inline CSS
      }
    }

    // Analyze HTML and CSS for best practices (very basic checks)
    const htmlIssues = [];
    if (!headings.length) htmlIssues.push('No headings found');
    if (!metaDescription) htmlIssues.push('No meta description found');
    if (!images.length) htmlIssues.push('No alt text for images found');

    const cssIssues = [];
    if (!cssContent.includes('media queries')) cssIssues.push('No media queries for responsiveness found');
    if (cssContent.includes('!important')) cssIssues.push('Use of "!important" found');
    if (cssContent.includes('position: absolute')) cssIssues.push('Use of "position: absolute" found');

    // Prepare the scraped data object
    const scrapedData = {
      title,
      metaDescription,
      headings,
      paragraphs,
      links,
      images,
      lists,
      cssIssues,
      htmlIssues,
    };

    // Use Groq AI to analyze the content
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are an AI assistant that analyzes web content based on industry standards for SEO optimization.'
        },
        {
          role: 'user',
          content: `
            In the first line, rate the website on a scale of 1-100 based off how standardized and effective is SEO is. Output it saying "SEO Rating: " 
            Second Line, generate Meta tags for the page. Analyze the following content based on industry standards for SEO:. 
            Suggest standardized SEO practices and how to implement them into the existing page. 
            Make sure your output is atleast 50 words, between 5 to 10 words per category. Only provide information that is necessary and make it personal."

            Title: ${scrapedData.title}
            Meta Description: ${scrapedData.metaDescription}
            HTML Issues: ${JSON.stringify(scrapedData.htmlIssues)}
            CSS Issues: ${JSON.stringify(scrapedData.cssIssues)}
            Headings: ${JSON.stringify(scrapedData.headings)}
            Paragraphs: ${JSON.stringify(scrapedData.paragraphs)}
            Links: ${JSON.stringify(scrapedData.links)}
            Images: ${JSON.stringify(scrapedData.images)}
            Lists: ${JSON.stringify(scrapedData.lists)}
          `,
        },
      ],
      model: 'mixtral-8x7b-32768',
      temperature: 0.5,
      max_tokens: 500,
    });

    return NextResponse.json({
      result: completion.choices[0].message.content,
      scrapedData,
    });

  } catch (error) {
    console.error('Scraping error:', error);
    return NextResponse.json(
      { error: 'Error scraping the website' },
      { status: 500 }
    );
  }
}
