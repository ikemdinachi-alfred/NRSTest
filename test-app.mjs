import fetch from "node-fetch";

async function testApp() {
  try {
    console.log("Fetching app...");
    const response = await fetch("http://localhost:5175/");
    const html = await response.text();
    console.log("Response status:", response.status);
    console.log("HTML includes root:", html.includes('id="root"'));
    console.log("HTML size:", html.length);
    console.log("HTML includes App:", html.includes("App"));
    console.log("HTML includes React:", html.includes("React"));

    // Check if this is valid HTML
    console.log(
      "HTML is valid:",
      html.includes("<!doctype") && html.includes("</html>"),
    );

    // Look for any errors
    if (html.includes("error") || html.includes("Error")) {
      console.log("Found error in HTML!");
      const errorMatch = html.match(/.*[Ee]rror.*/g);
      if (errorMatch) console.log("Error lines:", errorMatch);
    }
  } catch (error) {
    console.error("Error testing app:", error);
  }
}

testApp();
