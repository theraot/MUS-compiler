var compile = function (musexpr)
{
	var compileNote = function (elapsed, musexpr)
	{
		return {time: elapsed + musexpr.dur, data: [{tag: 'note', pitch: musexpr.pitch, start: elapsed, dur: musexpr.dur}]};
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

	var _compile = function (elapsed, musexpr)
	{
		if (musexpr.tag == 'seq')
		{
			return compileSeq(elapsed, musexpr);
		}
		else if (musexpr.tag == 'par')
		{
			return compilePar(elapsed, musexpr);
		}
		else if (musexpr.tag == 'note')
		{
			return compileNote(elapsed, musexpr);
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