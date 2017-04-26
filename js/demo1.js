!function() {
	'use strict';

	var canvas = document.querySelector('#webgl');

	// Scroll variables
	var scroll = 0.0, velocity = 0.0, lastScroll = 0.0;

	// initialize REGL from a canvas element
	var regl = createREGL({
		canvas: canvas,
		onDone: function(error, regl) {
			if (error) { alert(error); }
		}
	});

	// Create a REGL draw command
	var draw = regl({
		frag: document.querySelector('#fragmentShader').textContent,
		vert: 'attribute vec2 position; void main() { gl_Position = vec4(3.0 * position, 0.0, 1.0); }',
		attributes: { position: [-1, 0, 0, -1, 1, 1] },
		count: 3,
		uniforms: {
			globaltime: regl.prop('globaltime'),
			resolution: regl.prop('resolution'),
			aspect: regl.prop('aspect'),
			scroll: regl.prop('scroll'),
			velocity: regl.prop('velocity')
		}
	});

	// Hook a callback to execute each frame
	regl.frame(function(ctx) {
		// Resize a canvas element with the aspect ratio (100vw, 100vh)
		var aspect = canvas.scrollWidth / canvas.scrollHeight;
		canvas.width = 512 * aspect;
		canvas.height = 512;

		// Scroll amount (0.0 to 1.0)
		scroll = window.pageYOffset / (document.documentElement.scrollHeight - window.innerHeight);

		// Scroll velocity
		// Inertia example:
		// velocity = velocity * 0.99 + (scroll - lastScroll);
		velocity = 0;
		lastScroll = scroll;

		// Clear the draw buffer
		regl.clear({ color: [0, 0, 0, 0] });

		// Execute a REGL draw command
		draw({
			globaltime: ctx.time,
			resolution: [ctx.viewportWidth, ctx.viewportHeight],
			aspect: aspect,
			scroll: scroll,
			velocity: velocity
		});
	});

	setTimeout(function() { document.body.classList.remove('loading');}, 1000);

}();