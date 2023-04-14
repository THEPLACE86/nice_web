export default async (req, res) => {
    res.status(200).json({ buildTime: process.env.VERCEL_BUILD_TIME });
};
