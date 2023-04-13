//import twilio from 'twilio';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { message, phoneNumber } = req.body;

        // Twilio 인증 및 클라이언트 설정
        const accountSid = "AC64589d6bd3dd9f0873555e0593f89f5b"
        const authToken = "c6836f97bb4aea388a34587325a168b7"
        const client = "twilio(accountSid, authToken);"

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
