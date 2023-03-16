import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      }
    });
    return;
  }

  const jargon = req.body.jargon || '';
  if (jargon.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter valid tech jargon",
      }
    });
    return;
  }

  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generatePrompt(jargon),
      temperature: 0.6,
      max_tokens: 300,
    });
    console.log('HELLO')
    console.log(completion.data.choices)
    res.status(200).json({ result: completion.data.choices[0].text });
  } catch(error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }
}

function generatePrompt(jargon) {
  const capitalizedJargon =
    jargon[0].toUpperCase() + jargon.slice(1).toLowerCase();
  return `Define this software engineering concept to me like I'm 5

Jargon: API
Definition: Imagine you have a box of toys, but you don't know how to play with all of them. You ask your friend to show you how to play with a specific toy, and they show you how to use it. In this case, your friend is like an API. It helps you use a toy (or a software) by showing you how to play with it. An API is a set of instructions that tells other programs how to talk to each other and share information, just like your friend showed you how to play with a toy.
Jargon: LGTM
Definition: LGTM stands for "Looks Good To Me". It's something people say when they are looking at a picture or a document and they think everything is okay. It's like when you draw a picture and show it to your mom or dad, and they say "Wow, this looks great!" They are telling you that everything in the picture looks good and there's nothing wrong with it. When someone says "LGTM" about something you made, it means they think it's good and they don't see any problems with it. It's a nice way to show someone that you like what they made!
Jargon: What is a(n) ${capitalizedJargon}
Definition:`;
}
