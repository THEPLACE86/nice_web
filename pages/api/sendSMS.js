import twilio from "twilio";

export default async function handler(req, res) {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;

    if (req.method === 'POST') {
        const { message, phoneNumber } = req.body;

        const client = twilio(accountSid, authToken);

        // 문자 메시지 전송
        try {
            await client.messages.create({
                body: message,
                from: "+15075954494",
                to: phoneNumber,
            });

            res.status(200).json({ success: true });
        } catch (error) {
            console.error(error); // 서버 측 오류 메시지를 확인하세요.
            res.status(500).json({ error: error.message });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}
