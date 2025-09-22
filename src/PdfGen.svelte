<!-- PDFGenerator.svelte -->
<script lang="ts" context="module">
  import html2canvas from "html2canvas";
  import { jsPDF } from "jspdf";

  export async function generatePDF(elementId, fileName) {
    const element = document.getElementById(elementId);

    if (!element) {
      console.error(`Element with id ${elementId} not found`);
      return;
    }
    const interactiveElements = element.querySelectorAll(
      "button, input, select"
    );

    if (elementId != "chatWindowMessages") {
      // Hide buttons, inputs, and selects
      interactiveElements.forEach((element) => {
        element.style.display = "none";
      });
    }

    const interactiveElementss = element.querySelectorAll(".forPdf");
    console.log(interactiveElementss);
    interactiveElementss.forEach((element) => {
      element.style.display = "block";
    });
    const interactiveElementsss = element.querySelectorAll(".selectLayout");
    console.log(interactiveElementss);
    interactiveElementsss.forEach((element) => {
      element.style.display = "none";
    });

    // Store the original styles
    const originalStyle = element.style.cssText;

    // Get the element dimensions
    const elementRect = element.getBoundingClientRect();

    // Temporarily make the element large enough to include all content
    element.style.width = "auto";
    element.style.height = "auto";

    // Adjust font size to fit content
    const fontSize = parseFloat(window.getComputedStyle(element).fontSize);
    const scale = 1.5; // Adjust scale as needed
    element.style.fontSize = `${fontSize / scale}px`;

    const canvas = await html2canvas(element);

    // Restore the original styles
    element.style.cssText = originalStyle;

    // Restore the visibility of buttons, inputs, and selects
    if (elementId != "chatWindowMessages") {
      interactiveElements.forEach((element) => {
        element.style.display = "";
      });
    }
    interactiveElementss.forEach((element) => {
      element.style.display = "none";
    });
    interactiveElementsss.forEach((element) => {
      element.style.display = "flex";
    });

    const imgData = canvas.toDataURL("image/png");

    // Create PDF instance with appropriate size
    const pdf = new jsPDF({
      unit: "px", // Use pixels for dimensions
      format: [canvas.width + 20, canvas.height + 20], // Add some padding to avoid cutting off content
    });

    pdf.addImage(imgData, "PNG", 10, 10, canvas.width, canvas.height);
    pdf.save(fileName);
  }
  export async function generatePDFAll(scale: any) {
    return html2canvas(document.body, {
      scale: scale, // Increase scale for better quality
      useCORS: true, // Enable cross-origin images
      allowTaint: false, // Disable tainting
      logging: true, // Enable logging for debugging
      backgroundColor: null, // Capture transparent background
      onclone: function (documentClone) {
        // Ensure the font is correctly applied in the cloned document
        documentClone
          .querySelectorAll("button, input")
          .forEach(function (element) {
            element.style.fontFamily = "Roboto, sans-serif";
          });
      },
    });
  }
  function isBase64(str:any) {
    // Remove any characters that are not valid in a Base64 string
    const cleanedStr = str.replace(/[^A-Za-z0-9+/=]/g, '');

    // Check if the cleaned string has the right length and valid characters
    return (cleanedStr.length % 4 === 0) && /^[A-Za-z0-9+/]+[=]{0,2}$/.test(cleanedStr);
}

  export function base64ToPdf(base64String: any, fileName: any) {
    // Remove any characters that are not valid in a Base64 string
    base64String = base64String.replace(/[^A-Za-z0-9+/=]/g, "");

    // Ensure proper Base64 padding
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = base64String + padding;

    // Validate the Base64 string
    if (!isBase64(base64)) {
      console.error("Invalid Base64 string");
      return;
    }

    // Decode the Base64 string into a binary string
    let binaryString;
    try {
      binaryString = atob(base64);
    } catch (e) {
      console.error("Failed to decode Base64 string:", e);
      return;
    }

    // Create a Uint8Array to hold the binary data
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    // Create a blob from the binary data with the PDF MIME type
    const blob = new Blob([bytes], { type: "application/pdf" });

    // Create a link element
    const link = document.createElement("a");

    // Create a URL for the blob and set it as the href attribute
    link.href = window.URL.createObjectURL(blob);

    // Set the download attribute with the desired file name
    link.download = fileName;

    // Append the link to the body
    document.body.appendChild(link);

    // Programmatically click the link to trigger the download
    link.click();

    // Remove the link from the document
    document.body.removeChild(link);
  }

  // Example usage
  // const base64String = "JVBERi0xLjQKJcfsj6IKNSAwIG9iago8PC9UeXBlIC9DYXRhbG9nCi9QYWdlcyAyIDAgUgo+PmVuZG9iagoxIDAgb2JqCjw8L1R5cGUgL1BhZ2UKL1BhcmVudCAyIDAgUgo+PmVuZG9iagoyIDAgb2JqCjw8L1R5cGUgL1BhZ2VzCi9LaWRzIFsgMSAwIFIgXQovQ291bnQgMQovUmVzb3VyY2VzIDw8L1Byb2NTZXQgWy9QREZdCj4+Pj4+CmVuZG9iagpzdGFydHhyZWYKMwplbmRzdHJlYW0KZW5kb2JqCjQ1CiUlRU9GCg==";  // Replace with your actual Base64 string
  // const fileName = "example.pdf";
  // base64ToPdf(base64String, fileName);
</script>

<!-- PDFGenerator.svelte -->
