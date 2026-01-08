const fs = require('fs');
const path = require('path');

async function extractPDF() {
    // Dynamic import for pdfjs-dist
    const pdfjsLib = await import('pdfjs-dist/legacy/build/pdf.mjs');

    const pdfPath = path.resolve(__dirname, '../CIC_BIM_Profile.pdf');
    const outputPath = path.resolve(__dirname, '../CIC_BIM_Profile.txt');

    const data = new Uint8Array(fs.readFileSync(pdfPath));
    const loadingTask = pdfjsLib.getDocument({ data });

    const pdfDoc = await loadingTask.promise;
    console.log(`PDF has ${pdfDoc.numPages} pages`);

    let fullText = '';

    for (let i = 1; i <= pdfDoc.numPages; i++) {
        const page = await pdfDoc.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map(item => item.str).join(' ');
        fullText += `\n--- Page ${i} ---\n` + pageText;
    }

    fs.writeFileSync(outputPath, fullText);
    console.log('Extracted to CIC_BIM_Profile.txt');
}

extractPDF().catch(console.error);
