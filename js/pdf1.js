let loadingTask = null,
    pdfDoc = null,
    canvas = null,
    ctx = null,
    scale = null,
    numPage = null;


const GeneratePDF = numPage => {

    pdfDoc.getPage(numPage).then(page => {

        let viewport = page.getViewport({ scale: scale });
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        let renderContext = {
            canvasContext : ctx,
            viewport:  viewport
        }

        page.render(renderContext);
    })
    document.querySelector('#npages').innerHTML = numPage;

}

const PrevPage = () => {
    if(numPage === 1){
        return
    }
    numPage--;
    GeneratePDF(numPage);
}

const NextPage = () => {
    if(numPage >= pdfDoc.numPages){
        return
    }
    numPage++;
    GeneratePDF(numPage);
}

document.querySelector('#prev').addEventListener('click', PrevPage)
document.querySelector('#next').addEventListener('click', NextPage )

const PDFStart = nameRoute => {
    loadingTask = pdfjsLib.getDocument(nameRoute),
        pdfDoc = null,
        canvas = document.querySelector('#cnv'),
        ctx = canvas.getContext('2d'),
        scale = 1.5,
        numPage = 1;

    loadingTask.promise.then(pdfDoc_ => {
        pdfDoc = pdfDoc_;
        document.querySelector('#npages').innerHTML = pdfDoc.numPages;
        GeneratePDF(numPage)
    });


}

const startPdf = (filePath) => {
    PDFStart(filePath)
}

const clearPdf = () => {
    if(pdfDoc) {
        pdfDoc.destroy()
    }

    if(ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

}

// window.addEventListener('load', startPdf);
