import { Html5Qrcode } from "html5-qrcode";

let cameraID;

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const devices = await Html5Qrcode.getCameras()
        if (devices && devices.length) {
            const cameraID = devices.find(device => device.label.toLowerCase().includes("rear") || device.label.toLowerCase().includes("back")).id
            // const cameraID = devices[0].id
            console.log(devices)
            const qrScanner = new Html5Qrcode("qrScanner")

            try {
                qrScanner.start(
                    cameraID,
                    {
                        fps: 24,
                        qrbox: 250,
                        aspectRatio: 1.0
                    },

                    qrCodeMessage => {
                        alert("The qr code says: " + qrCodeMessage)
                    },

                    errorMessage => {
                        console.log(errorMessage);
                    }
                )
            } catch (err) {
                alert("Error starting QR Scanner again");
                console.log(err)
            }
        } else {
            alert("Camera Permissions are Required")
        }
    } catch (err) {
        alert("Error getting cameras")
        console.log(err)
    }
})
