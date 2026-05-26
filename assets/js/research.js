(function () {
	var root = document.documentElement;
	var toggle = document.querySelector(".theme-toggle");
	var year = document.getElementById("year");
	var navLinks = Array.prototype.slice.call(document.querySelectorAll(".nav-scroller a"));
	var sections = navLinks
		.map(function (link) {
			var id = link.getAttribute("href");
			return id && id.charAt(0) === "#" ? document.querySelector(id) : null;
		})
		.filter(Boolean);

	if (year) {
		year.textContent = String(new Date().getFullYear());
	}

	function setTheme(theme) {
		root.dataset.theme = theme;
		try {
			localStorage.setItem("theme", theme);
		} catch (error) {
			/* Theme still applies for the current session. */
		}
		if (toggle) {
			toggle.setAttribute("aria-label", theme === "dark" ? "Switch to light mode" : "Switch to dark mode");
		}
	}

	if (toggle) {
		toggle.addEventListener("click", function () {
			setTheme(root.dataset.theme === "dark" ? "light" : "dark");
		});
	}

	if ("IntersectionObserver" in window) {
		var revealObserver = new IntersectionObserver(
			function (entries) {
				entries.forEach(function (entry) {
					if (entry.isIntersecting) {
						entry.target.classList.add("is-visible");
						revealObserver.unobserve(entry.target);
					}
				});
			},
			{ threshold: 0.12 }
		);

		document.querySelectorAll(".reveal").forEach(function (element) {
			revealObserver.observe(element);
		});

		var activeObserver = new IntersectionObserver(
			function (entries) {
				entries.forEach(function (entry) {
					if (!entry.isIntersecting) {
						return;
					}

					navLinks.forEach(function (link) {
						link.classList.toggle("is-active", link.getAttribute("href") === "#" + entry.target.id);
					});
				});
			},
			{
				rootMargin: "-25% 0px -58% 0px",
				threshold: 0
			}
		);

		sections.forEach(function (section) {
			activeObserver.observe(section);
		});
	} else {
		document.querySelectorAll(".reveal").forEach(function (element) {
			element.classList.add("is-visible");
		});
	}
})();
