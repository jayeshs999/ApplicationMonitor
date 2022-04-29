function logout(req, res, pool) {

	pool.query("DELETE FROM Sessions WHERE SessionID=($1)", [req.sessionID], (err,result) => {
        if (err) {
            console.log(err);
            res.status(500).send(err);
        }
        else{
            res.json({ message: "Successfully Logged Out" });
            console.log("[LOGOUT] Logout Success ", req.sessionID);
        }
	});

}

module.exports = logout;