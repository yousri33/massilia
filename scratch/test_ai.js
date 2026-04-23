const { GoogleGenerativeAI } = require("@google/generative-ai");

async function test() {
  const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GOOGLE_AI_API_KEY || "");
  const models = ["gemini-2.0-flash", "gemini-1.5-flash"];
  
  for (const modelName of models) {
    try {
      console.log(`Testing ${modelName}...`);
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent("Hello, are you working?");
      const response = await result.response;
      console.log(`Success with ${modelName}:`, response.text().substring(0, 50));
      return;
    } catch (e) {
      console.error(`Failed ${modelName}:`, e.message);
    }
  }
}

test();
