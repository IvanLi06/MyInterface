import { Groq } from 'groq-sdk';
import { NextResponse } from 'next/server';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(request) {
  try {
    // Get the raw user input from the request body
    const userRequest = await request.text(); // Raw text input from user

    // Validate input
    if (!userRequest.trim()) {
      return NextResponse.json(
        { error: 'No input provided. Please specify what code you need.' },
        { status: 400 }
      );
    }

    // Construct the system message dynamically based on user input
    const systemMessage = `ASSUME ALL DEPENDENCIES ARE INSTALLED. MAKE ONLY WHAT IS ASKED
      REPLY encased in <div> with Generate Componenet 
      (dont say sure, dont say anything just generate) Code ONLY.
       Create the entire div element. HTML and CSS ONLY. Create all 
      styling with INDUSTRY STANDARD(standard padding,gaps,sizing). `;
    // ASSUME ALL DEPENDENCIES ARE INSTALLED. MAKE ONLY WHAT IS ASKED
    // REPLY encased in <div> with Generate Componenet 
    // (dont say sure, dont say anything just generate) Code ONLY.
    //  Create the entire div element. HTML and CSS ONLY. Create all 
    //  styling with INDUSTRY STANDARD(standard padding,gaps,sizing) 
    //  here are some rules you HAVE to follow: all background colors 
    //  have to be white. Font family has to be Arial. UNLESS ASKED OTHERWISE, when 
    //  asked to create a navbar, title on left, anchor tags on right. FOR EXAMPLE, navbar asked for 
    //  search bar put it next to right anchors.  Search bar should have a search icon. Create 
    //  with fontawsome icons. Use font size 27 for all h1 tags, 21 for h2 tags, 16 for p tags, 12 
    //  for secondary p tag. if SPECIFICALLY asked to make a 
    //  landing page, remember that LANDING PAGES NEED TO HAVE AT LEAST ONE CALL TO ACTION

    // Use Groq AI to generate the requested code
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: systemMessage
        },
        {
          role: 'user',
          content: userRequest, // Directly use the raw user input
        },
      ],
      model: 'mixtral-8x7b-32768',
      temperature: 0.5,
      max_tokens: 1500, // Adjust max tokens to accommodate the code component
    });

    return NextResponse.json({
      result: completion.choices[0].message.content, // The generated code for the requested component
    });

  } catch (error) {
    console.error('Processing error:', error);
    return NextResponse.json(
      { error: `Error processing the input: ${error.message}` },
      { status: 500 }
    );
  }
}
