async function authenticateWithFingerprint() {
    if (window.PublicKeyCredential) {
        try {
            // Step 1: Get Challenge from Server
            const challengeResponse = await fetch('/.netlify/functions/webauthn-challenge');
            const { challenge } = await challengeResponse.json();

            // Step 2: WebAuthn API Call
            const options = {
                publicKey: {
                    challenge: Uint8Array.from(atob(challenge), c => c.charCodeAt(0)),
                    userVerification: 'preferred', // Prioritizes biometrics
                    authenticatorSelection: { authenticatorAttachment: 'platform' } // Use built-in Touch ID
                }
            };

            const credential = await navigator.credentials.get(options);

            // Step 3: Send Credential to Server for Verification
            const authenticateResponse = await fetch('/.netlify/functions/webauthn-authenticate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ credential, challenge })
            });

            const result = await authenticateResponse.json();
            if (result.success) {
                alert("Authentication successful!");
                showPasswords();
            } else {
                alert("Authentication failed. Please try again.");
            }
        } catch (error) {
            alert("Fingerprint authentication failed. Please try again.");
            console.error(error);
        }
    } else {
        alert("Fingerprint authentication not supported on this device.");
    }
}

// Call the authentication function on page load
window.onload = function() {
    authenticateWithFingerprint();
};

// Function to mask password with asterisks
function maskPassword(pass) {
    let str = "";
    for (let index = 0; index < pass.length; index++) {
        str += "*";
    }
    return str;
}

// Other functions like copyText, deletePassword, showPasswords, etc.

function copyText(txt) {
    navigator.clipboard.writeText(txt).then(
        () => {
            document.getElementById("alert").style.display = "inline";
            setTimeout(() => {
                document.getElementById("alert").style.display = "none";
            }, 2000);
        },
        () => {
            alert("Clipboard copying failed");
        }
    );
}

const deletePassword = (website) => {
    let data = localStorage.getItem("passwords");
    let arr = JSON.parse(data);
    let arrUpdated = arr.filter((e) => e.website != website);
    localStorage.setItem("passwords", JSON.stringify(arrUpdated));
    alert(`Successfully deleted ${website}'s password`);
    showPasswords();
};

// Logic to fill the table
const showPasswords = () => {
    let tb = document.querySelector("table");
    let data = localStorage.getItem("passwords");
    if (data == null || JSON.parse(data).length == 0) {
        tb.innerHTML = "No Data To Show";
    } else {
        tb.innerHTML = `<tr>
        <th>Website</th>
        <th>Username</th>
        <th>Password</th>
        <th>Delete</th>
    </tr>`;
        let arr = JSON.parse(data);
        let str = "";
        for (let index = 0; index < arr.length; index++) {
            const element = arr[index];

            str += `<tr>
                <td>${element.website} <img onclick="copyText('${element.website}')" src="./copy.svg" alt="Copy Button" width="10" height="10"></td>
                <td>${element.username} <img onclick="copyText('${element.username}')" src="./copy.svg" alt="Copy Button" width="10" height="10"></td>
                <td>${maskPassword(element.password)} <img onclick="copyText('${element.password}')" src="./copy.svg" alt="Copy Button" width="10" height="10"></td>
                <td><button class="btnsm" onclick="deletePassword('${element.website}')">Delete</button></td>
            </tr>`;
        }
        tb.innerHTML += str;
    }
    website.value = "";
    username.value = "";
    password.value = "";
}

console.log("Working");
showPasswords();
document.querySelector(".btn").addEventListener("click", (e) => {
    e.preventDefault();
    let passwords = localStorage.getItem("passwords");
    if (passwords == null) {
        let json = [];
        json.push({ website: website.value, username: username.value, password: password.value });
        alert("Password Saved");
        localStorage.setItem("passwords", JSON.stringify(json));
    } else {
        let json = JSON.parse(localStorage.getItem("passwords"));
        json.push({ website: website.value, username: username.value, password: password.value });
        alert("Password Saved");
        localStorage.setItem("passwords", JSON.stringify(json));
    }
    showPasswords();
});
