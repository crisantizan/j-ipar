export default {
	_token: null,

	set(value) {
		this._token = value;
	},

	get() {
		return this._token;
	},
};
