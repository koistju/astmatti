/**
 * This is a JavaScript implementation of the pin code scheme. AA-78
 *
 * @author  Simo Särkkä
 * @version 1.0
 */

const PinCodecError = {
    NONE: 'No error',
    LENGTH: 'Illegal PIN length',
    CHAR: 'Illegal character in string',
    CHECKSUM: 'Checksum mismatch',
    RANGE: 'Value was out of range',
    DATENULL: 'Date was null',
    BINLEN: 'Length of binary was illegal',
    BINCHAR: 'Character in binary was illegal'
}

/**
 * The codec main class
 */
function PinCodec() {
    this.year_of_birth = 1900;   // Directly the year 1900-2155
    this.gender = 0;             // Gender, 0=female, 1=male
    this.version = 0;            // Astmatti version 0-7
    this.appointment = null;     // Appointment time (UTC)
    this.organization = 0;       // Organization 0-1023
    this.language = 0;           // Language 0-63

    this.TABLE = "0123456789ABCDEFGHJKLMNPQSTUWXYZ";
    this.SUBST = "I1O0VU";
    this.EPOCH = new Date(Date.parse("2019-01-01T00:00:00.00Z"));

    this.error = PinCodecError.NONE;

    /**
     * Convert integer to binary string.
     */
    this.dec2bin = function(num, digits) {
	var str = '';
    
	for (var i = 0; i < digits; i++) {
	    if (num % 2 == 0) {
		str = '0' + str;
	    }
	    else {
		str = '1' + str;
	    }
	    num = Math.floor(num / 2);
	}
	return str;
    };

    /**
     * Convert binary string to integer. Returns -1 on error.
     */
    this.bin2dec = function(str) {
	var num = 0;
	
	for (var i = 0; i < str.length; i++) {
	    if (str[i] == '0') {
		num = (num << 1);
	    }
	    else if (str[i] == '1') {
		num = (num << 1) + 1;
	    }
	    else {
		return -1;
	    }
	}
	
	return num;
    };

    /**
     * Compute checksum of the given binary string. Always returns zero
     * for strings of length < 5.
     */
    this.checksum = function(binstr) {
	var cs = 0;
	
	for (i = 0; i < binstr.length - 5; i += 5) {
	    cs ^= this.bin2dec(binstr.substring(i, i+5));
	}
	
	return cs;
    };

    /**
     * Check the checksum in the given binary. Returns false
     * if the string length is not at least 5.
     */
    this.checkChecksum = function(binstr) {
	if (binstr.length < 5)
	    return false;
	
	return this.checksum(binstr) == this.bin2dec(binstr.substring(binstr.length-5));
    };

    /**
     * Convert the given binary pin into a string. Returns null
     * and sets error variable if the length of the binary is not 60
     * or if the binary string is invalid.
     */
    this.convertBinaryPinToString = function(binstr) {
	var str = '';
	var index;

	if (binstr.length != 60) {
	    this.error = PinCodecError.BINLEN;
	    return null;
	}
	
	for (i = 0; i < binstr.length; i += 5) {
	    index = this.bin2dec(binstr.substring(i, i+5));
	    if (index < 0) {
		this.error = PinCodecError.BINCHAR;
		return null;
	    }
	    str = str + this.TABLE[index];
	}
	
	return str;
    };

    /**
     * Convert the given string pin into binary. Returns null
     * on error and sets the error variable.
     */
    this.convertStringPinToBinary = function(pin) {
	var binstr = '';

	if (pin.length != 12) {
	    this.error = PinCodecError.LENGTH;
	    return null;
	}

	pin = pin.toUpperCase();
	
	for (var i = 0; i < pin.length; i++) {
	    
	    // Substitutions
	    var ch = pin[i];
	    for (var j = 0; j < this.SUBST.length; j+=2) {
		if (ch == this.SUBST[j]) {
		    ch = this.SUBST[j+1];
		}
	    }

	    // Find and insert to number
	    var ind = this.TABLE.indexOf(ch);
	    if (ind < 0) {
		this.error = PinCodecError.CHAR;
		return null;
	    }

	    binstr = binstr + this.dec2bin(ind,5);
	}
	
	return binstr;
    };

    /**
     * Extract the fields in the binary into the object. Returns false
     * if the length of the binary is not 60 and sets the error variable.
     */
    this.convertBinaryToFields = function(binstr) {
	if (binstr.length != 60) {
	    this.error = PinCodecError.BINLEN;
	    return false;
	}

	for (var i = 0; i < binstr.length; i++) {
	    if (binstr[i] != '0' && binstr[i] != '1') {
		this.error = PinCodecError.BINCHAR;
		return false;
	    }
	}
	
	this.year_of_birth = this.bin2dec(binstr.substring(0,8)) + 1900;
	this.gender = this.bin2dec(binstr.substring(8,9));
	this.version = this.bin2dec(binstr.substring(9,12));
	var minutes = this.bin2dec(binstr.substring(12,36));
	var milliseconds = this.EPOCH.getTime() + minutes * 60 * 5 * 1000;
	this.appointment = new Date(milliseconds);
	
	// Note that in theory we could get some trouble from leap seconds
	// as we might get non-zero seconds from this. The solution would be
	// to round the values properly, Does not seem to be a problem now though.

	this.organization = this.bin2dec(binstr.substring(36,46));
	this.language = this.bin2dec(binstr.substring(46,52));

	return true;
    };

    /**
     * Convert the fields in the object to binary. Also computes the checksum.
     * Returns null on error and sets the error variable.
     */
    this.convertFieldsToBinary = function() {
	var binstr = '';
	
	if (this.year_of_birth < 1900 || this.year_of_birth > 2155 ||
	    this.gender < 0  || this.gender > 1 ||
	    this.version < 0 || this.version > 7 ||
	    this.organization < 0 || this.organization > 1023 ||
	    this.language < 0 || this.language > 63)
	{
	    this.error = PinCodecError.RANGE;
	    return null;
	}
	if (this.appointment == null) {
	    this.error = PinCodecError.DATENULL;
	    return null;
	}

	binstr += this.dec2bin(this.year_of_birth - 1900, 8);
	binstr += this.dec2bin(this.gender, 1);
	binstr += this.dec2bin(this.version, 3);
	var minutes = Math.floor( (this.appointment.getTime() - this.EPOCH.getTime()) / (60 * 5 * 1000) );
	binstr += this.dec2bin(minutes, 24);
	binstr += this.dec2bin(this.organization, 10);
	binstr += this.dec2bin(this.language, 6);
	binstr += '000';
	var tmp = binstr + '00000';
	binstr += this.dec2bin(this.checksum(tmp), 5);

	return binstr;
    };

    /**
     * Convenience method that does the whole encoding. Returns null on
     * failure and sets the error code.
     */
    this.encode = function() {
	var bin = this.convertFieldsToBinary();

	if (bin == null) {
	    return null;
	}
	
	return this.convertBinaryPinToString(bin);
    };
    
    /**
     * Convenience method that does the whole decoding. Returns false on
     * failure and sets the error code.
     */
    this.decode = function(pin) {
	var bin = this.convertStringPinToBinary(pin);

	if (bin == null) {
	    return false;
	}

	if (!this.checkChecksum(bin)) {
	    this.error = PinCodecError.CHECKSUM;
	    return false;
	}

	if (!this.convertBinaryToFields(bin)) {
	    return false;
	}

	return true;
    };
}

// Exports for node.js
exports.PinCodecError = PinCodecError;
exports.PinCodec = PinCodec;