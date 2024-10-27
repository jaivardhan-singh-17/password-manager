exports.handler = async (event, context) => {
    try {
        const { credential, challenge } = JSON.parse(event.body);
        // Normally, you'd validate the credential response here
        const isValid = credential && challenge; // Simplified for demonstration

        if (isValid) {
            return {
                statusCode: 200,
                body: JSON.stringify({ success: true, message: "Authentication successful" }),
            };
        } else {
            return {
                statusCode: 400,
                body: JSON.stringify({ success: false, message: "Authentication failed" }),
            };
        }
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ success: false, message: "Server error" }),
        };
    }
};
