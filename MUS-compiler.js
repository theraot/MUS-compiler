var compile = function (musexpr)
{
	var compileNote = function (elapsed, musexpr)
	{
		var convertPitch = function(pitch)
		{
			/*
			 * To write convertPitch, you need to break apart the pitch
			 * letter and the octave.
			 * The MIDI number is 12 + 12 * octave + letterPitch.
			 * The letterPitch is 0 for C, 2 for D, up to 11 for B.
			 * */
			 var letter = pitch.substr(0, 1);
			 var letterPitch = {"c" : 0, /*"c#" : 1,*/ "d" : 2, /*"d#" : 3,*/ "e" : 4, "f" : 5, /*"f#" : 6,*/ "g" : 7, /*"g#" : 8,*/ "a" : 9, /*"a#" : 10,*/ "b" : 11};
			 var octave = parseInt(pitch.substr(1));
			 return 12 + 12 * octave + letterPitch[letter];
		}
		return {time: elapsed + musexpr.dur, data: [{tag: 'note', pitch: convertPitch(musexpr.pitch), start: elapsed, dur: musexpr.dur}]};
	};

	var compileSeq = function (elapsed, musexpr)
	{ 
		var leftCompiled = _compile(elapsed, musexpr.left);
		var rightCompiled = _compile(leftCompiled.time, musexpr.right);
		return {time: rightCompiled.time, data: leftCompiled.data.concat(rightCompiled.data)};
	};

	var compilePar = function (elapsed, musexpr)
	{ 
		var leftCompiled = _compile(elapsed, musexpr.left);
		var rightCompiled = _compile(elapsed, musexpr.right);
		var totalTime = leftCompiled.time;
		if (rightCompiled.time > totalTime)
		{
			totalTime = rightCompiled.time;
		}
		return {time: totalTime, data: leftCompiled.data.concat(rightCompiled.data)};
	};

	var compileRest = function (elapsed, musexpr)
	{
		return {time: elapsed + musexpr.duration, data: []};
	};
	
	var compileRepeat = function (elapsed, musexpr)
	{
		var result = [];
		for (var index = 0; index < musexpr.count; index++)
		{
			var iteration = _compile(elapsed, musexpr.section);
			elapsed += iteration.time;
			result = result.concat(iteration.data);
		}
		return {time: elapsed, data: result};
	};

	var _compile = function (elapsed, musexpr)
	{
		if (musexpr.tag == 'note')
		{
			return compileNote(elapsed, musexpr);
		}
		else if (musexpr.tag == 'seq')
		{
			return compileSeq(elapsed, musexpr);
		}
		else if (musexpr.tag == 'par')
		{
			return compilePar(elapsed, musexpr);
		}
		else if (musexpr.tag == 'rest')
		{
			return compileRest(elapsed, musexpr);
		}
		else if (musexpr.tag == 'repeat')
		{
			return compileRepeat(elapsed, musexpr);
		}
	};

	var compiled = _compile(0, musexpr);
	if (typeof compiled == 'object')
	{
		return compiled.data;
	}
	else
	{
		return [];
	}
};