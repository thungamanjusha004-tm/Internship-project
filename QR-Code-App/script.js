let scanner = null;
let lastResult = "";


// ==========================================
// SHOW SCANNER
// ==========================================

function showScanner() {

    document
        .getElementById("scannerSection")
        .classList.remove("hidden");

    document
        .getElementById("generatorSection")
        .classList.add("hidden");

    document
        .getElementById("scannerTab")
        .classList.add("active");

    document
        .getElementById("generatorTab")
        .classList.remove("active");

    startScanner();
}


// ==========================================
// SHOW GENERATOR
// ==========================================

function showGenerator() {

    document
        .getElementById("scannerSection")
        .classList.add("hidden");

    document
        .getElementById("generatorSection")
        .classList.remove("hidden");

    document
        .getElementById("scannerTab")
        .classList.remove("active");

    document
        .getElementById("generatorTab")
        .classList.add("active");

    stopScanner();
}


// ==========================================
// START QR SCANNER
// ==========================================

function startScanner() {

    if (scanner !== null) {
        return;
    }

    scanner = new Html5Qrcode("reader");

    const config = {
        fps: 10,

        qrbox: {
            width: 250,
            height: 250
        }
    };

    scanner
        .start(
            {
                facingMode: "environment"
            },

            config,

            onScanSuccess,

            onScanError
        )

        .catch(function(error) {

            console.error(
                "Camera error:",
                error
            );

            document.getElementById(
                "reader"
            ).innerHTML = `
                <p style="color:red; padding:20px;">
                    Camera access failed.
                    Please allow camera permission.
                </p>
            `;
        });
}


// ==========================================
// QR SCAN SUCCESS
// ==========================================

function onScanSuccess(decodedText) {

    if (decodedText === lastResult) {
        return;
    }

    lastResult = decodedText;

    document.getElementById(
        "scanResult"
    ).classList.remove("hidden");

    document.getElementById(
        "resultText"
    ).textContent = decodedText;

    // Stop scanning after successful scan
    stopScanner();
}


// ==========================================
// QR SCAN ERROR
// ==========================================

function onScanError(error) {
    // Ignore scanning errors
}


// ==========================================
// STOP SCANNER
// ==========================================

function stopScanner() {

    if (scanner === null) {
        return;
    }

    scanner
        .stop()
        .then(function() {

            scanner.clear();

            scanner = null;

        })
        .catch(function(error) {

            console.log(
                "Scanner stop error:",
                error
            );

            scanner = null;
        });
}


// ==========================================
// COPY RESULT
// ==========================================

function copyResult() {

    const result =
        document.getElementById(
            "resultText"
        ).textContent;

    navigator.clipboard
        .writeText(result)
        .then(function() {

            alert(
                "QR result copied!"
            );

        })
        .catch(function() {

            alert(
                "Unable to copy result."
            );
        });
}


// ==========================================
// GENERATE QR CODE
// ==========================================

function generateQR() {

    const text =
        document.getElementById(
            "qrText"
        ).value.trim();

    const qrContainer =
        document.getElementById(
            "qrcode"
        );

    const downloadButton =
        document.getElementById(
            "downloadBtn"
        );


    if (text === "") {

        alert(
            "Please enter text or a URL."
        );

        return;
    }


    // Clear old QR code

    qrContainer.innerHTML = "";


    // Create QR code

    new QRCode(
        qrContainer,
        {
            text: text,

            width: 220,

            height: 220,

            colorDark: "#000000",

            colorLight: "#ffffff",

            correctLevel:
                QRCode.CorrectLevel.H
        }
    );


    downloadButton.classList.remove(
        "hidden"
    );
}


// ==========================================
// DOWNLOAD QR CODE
// ==========================================

function downloadQR() {

    const qrImage =
        document.querySelector(
            "#qrcode img"
        );

    if (!qrImage) {

        alert(
            "Please generate a QR code first."
        );

        return;
    }


    const link =
        document.createElement("a");

    link.href = qrImage.src;

    link.download =
        "my-qr-code.png";

    link.click();
}


// ==========================================
// START APPLICATION
// ==========================================

window.addEventListener(
    "load",
    function() {

        startScanner();

    }
);
