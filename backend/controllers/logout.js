function logout(req, res, pool) {

	pool.query("DELETE FROM Sessions WHERE SessionID=(?)", [req.sessionID], () => {
		res.json({ message: "Successfully Logged Out" });
		console.log("[LOGOUT] Logout Success ", req.sessionID);
	});

}

module.exports = logout;