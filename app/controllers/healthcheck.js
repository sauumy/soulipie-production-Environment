exports.healthcheck = async (req, res) => {
	// optional: add further things to check (e.g. connecting to dababase)
    const healthcheck = {
        uptime: process.uptime(),
        message: 'OK',
        timestamp: Date.now() // Generate current timestamp
      };
    
      try {
        res.send(healthcheck);
      } catch (e) {
        healthcheck.message = e;
        res.status(503).send();
      }
};