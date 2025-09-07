module.exports = (req, res) => {
  res.status(200).json({ ok: true, env: !!process.env.MAPBOX_TOKEN });
};
