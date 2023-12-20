let inputTag = document.getElementById("name");
let inputTagCourse = document.getElementById("course");
let certificateForm = document.getElementById("certificate-form");
let submit = document.getElementById('submit');

const capitalize = (str, lower = false) =>
  (lower ? str.toLowerCase() : str).replace(/(?:^|\s|["'([{])+\S/g, (match) =>
    match.toUpperCase()
  );

certificateForm.addEventListener("submit", (e) => {
  e.preventDefault()
  let credentialUser = Math.ceil(Math.random() * 10000);
  let str = "BATCH_55 - " + credentialUser.toString();
  const val = capitalize(inputTag.value.trim()); // Use inputTag here
  const course = capitalize(inputTagCourse.value.trim()); // Use inputTagCourse here
  
  generetPdf(val, str, course);
  certificateForm.reset()
});

const generetPdf = async (name, cr, course) => {
    const { PDFDocument, rgb } = PDFLib;

    const exBytes = await fetch("./Certificate.pdf").then((res) => {
        return res.arrayBuffer()
    });
    const exFont = await fetch('./MTCORSVA.TTF').then((res) => {
        return res.arrayBuffer();
    })
    const montserratFont = await fetch('./Montserrat-Regular.ttf').then((res) => {
      return res.arrayBuffer();
    });
    const signatureImageBytes = await fetch('./Signiture.png').then((res) => {
      return res.arrayBuffer();
    });

    const pdfDoc = await PDFDocument.load(exBytes)

    pdfDoc.registerFontkit(fontkit);
    const myFont = await pdfDoc.embedFont(exFont);//name
    const myFont2 = await pdfDoc.embedFont(exFont);//course
    const montserrat = await pdfDoc.embedFont(montserratFont); // Montserrat font for "cr"
    const signatureImage = await pdfDoc.embedPng(signatureImageBytes); // Signature image
    

    const pages = pdfDoc.getPages();
    const firstP = pages[0];

     // name
    const textSize = 75;
    const textWidth = myFont.widthOfTextAtSize(name, textSize);

     // course
    const courseTextSize = 24;
    const courseTextWidth = myFont2.widthOfTextAtSize(course, courseTextSize);
    const courseX = Math.min(Math.max(400, 500 - courseTextWidth / 2), 600);

    firstP.drawText(name, {
        x: firstP.getWidth() / 2 - textWidth / 2, // Adjust the x-coordinate as needed
        y: 310, // Adjust the y-coordinate as needed
        size: textSize, 
        font: myFont,
        color: rgb(0.6352941176470588, 0.4823529411764706, 0.25882352941176473),
    });

    firstP.drawText(cr, {
        x: 250, // Adjust the x-coordinate as needed
        y: 63, // Adjust the y-coordinate as needed
        size: 12, // Adjust the font size as needed
        font: montserrat,
        color: rgb(0, 0, 0)
    });

    firstP.drawText(course, {
        x: courseX, // Adjust the x-coordinate as needed
        y: 263, // Adjust the y-coordinate as needed
        size: 24, // Adjust the font size as needed
        font: myFont2,
        color: rgb(0.6352941176470588, 0.4823529411764706, 0.25882352941176473)
    });

    // Overlay the signature image
    const signatureScale = 0.5; // Adjust the scale as needed
    const signatureWidth = signatureImage.width * signatureScale;
    const signatureHeight = signatureImage.height * signatureScale;

    firstP.drawImage(signatureImage, {
        x: 280,
        y: 50,
        width: signatureWidth,
        height: signatureHeight,
    });

    const uri = await pdfDoc.saveAsBase64({ dataUri: true });
    saveAs(uri, name + "_Certificate.pdf", { autoBom: true })
};
