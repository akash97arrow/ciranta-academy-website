// 	Learning tabs functionality:
document.addEventListener('DOMContentLoaded', () => {
	// program data
	const programmeData = {
		'Resume Building Mastery': {
			category: 'CAREER ADVANCEMENT',
			duration: '🕛 3 weeks',

			description:
				'Build a professional, focused resume that clearly communicates your skills, experience and career value. This programme combines practical resume-building exercises with personal branding guidance.',

			learning: [
				'How to structure a professional resume',
				'How to highlight relevant skills and achievements',
				'How to write stronger professional summaries',
				'How to tailor your resume for different opportunities',
				'Personal branding fundamentals',
			],

			audience:
				'Students, fresh graduates and professionals looking to improve their resumes and present their experience more effectively.',
		},

		'Mock Interview Workshops': {
			category: 'CAREER ADVANCEMENT',
			duration: '🕛 4 weeks',

			description:
				'Practise realistic interview situations through guided mock interviews designed to improve your communication, preparation and ability to respond confidently.',

			learning: [
				'How to approach common interview questions',
				'How to structure clear and concise answers',
				'How to handle behavioural and technical questions',
				'How to respond to follow-up questions',
				'How to use feedback to improve performance',
			],

			audience: 'Job seekers, graduates and professionals preparing for upcoming interviews.',
		},

		'Behavioral Interview Strategies': {
			category: 'CAREER ADVANCEMENT',
			duration: '🕛 2 weeks',

			description:
				'Learn how to approach behavioural interviews with structured answers, practical examples and techniques for communicating your experiences clearly.',

			learning: [
				'STAR method',
				'Common behavioural question patterns',
				'Choosing relevant examples',
				'Structuring concise answers',
				'Building interview confidence',
			],

			audience:
				'Anyone preparing for interviews where communication, experience and workplace behaviour are evaluated.',
		},

		'Technical Interview Essentials': {
			category: 'CAREER ADVANCEMENT',
			duration: '🕛 4 weeks',

			description:
				'Strengthen your technical interview preparation through concept revision, problem-solving exercises and realistic mock coding sessions.',

			learning: [
				'Core technical concepts',
				'Problem-solving approaches',
				'Common technical interview patterns',
				'Coding practice strategies',
				'Mock technical interview preparation',
			],

			audience: 'Students, developers and technical professionals preparing for technical interviews.',
		},

		'Strategic Leadership': {
			category: 'BUSINESS MANAGEMENT',
			duration: '🕛 5 weeks',

			description:
				'Develop practical leadership skills for making better decisions, guiding teams and creating a clear direction within an organisation.',

			learning: [
				'Leadership frameworks',
				'Strategic decision-making',
				'Team motivation',
				'Delegation techniques',
				'Goal setting and alignment',
			],

			audience: 'Managers, team leaders and professionals preparing for leadership responsibilities.',
		},

		'Project Management Fundamentals': {
			category: 'BUSINESS MANAGEMENT',
			duration: '🕛 6 weeks',

			description:
				'Learn the foundations of planning, managing and delivering projects while understanding different project management approaches.',

			learning: [
				'Project planning fundamentals',
				'Agile and Waterfall approaches',
				'Risk management',
				'Resource planning',
				'Project tracking and coordination',
			],

			audience: 'Aspiring project managers, team members and professionals involved in project-based work.',
		},

		'Financial Acumen for Managers': {
			category: 'BUSINESS MANAGEMENT',
			duration: '🕛 4 weeks',

			description:
				'Build a practical understanding of financial information and learn how managers can use financial insights to support better business decisions.',

			learning: [
				'Understanding financial statements',
				'Budgeting fundamentals',
				'Forecasting',
				'Financial performance indicators',
				'Using financial information for decisions',
			],

			audience:
				'Managers, team leaders and professionals who want to improve their understanding of business finance.',
		},

		'Change Management': {
			category: 'BUSINESS MANAGEMENT',
			duration: '🕛 3 weeks',

			description:
				'Understand how to guide teams through organisational change while maintaining communication, engagement and alignment.',

			learning: [
				'Change management fundamentals',
				'Managing workplace transitions',
				'Stakeholder engagement',
				'Communication strategies',
				'Handling resistance to change',
			],

			audience: 'Managers, team leaders and professionals involved in organisational change.',
		},

		'Digital Marketing Essentials': {
			category: 'MARKETING',
			duration: '🕛 5 weeks',

			description:
				'Build a strong foundation in digital marketing and understand how different online channels can support business and brand goals.',

			learning: [
				'SEO fundamentals',
				'Search engine marketing',
				'Content marketing',
				'Email marketing',
				'Analytics and KPIs',
			],

			audience:
				'Students, entrepreneurs, marketing professionals and anyone beginning a career in digital marketing.',
		},

		'Content Marketing Strategies': {
			category: 'MARKETING',
			duration: '🕛 4 weeks',

			description:
				'Learn how to create purposeful content that connects with the right audience and supports broader marketing objectives.',

			learning: [
				'Content strategy fundamentals',
				'Storytelling techniques',
				'Audience targeting',
				'Content planning',
				'Content calendars',
			],

			audience: 'Marketing professionals, content creators, entrepreneurs and aspiring digital marketers.',
		},

		'Social Media Advertising': {
			category: 'MARKETING',
			duration: '🕛 3 weeks',

			description:
				'Understand the fundamentals of paid social media campaigns and learn how to plan, create and evaluate advertising campaigns.',

			learning: [
				'Social advertising fundamentals',
				'Ad platform concepts',
				'Campaign planning',
				'Audience targeting',
				'Performance tracking',
			],

			audience: 'Marketing professionals, entrepreneurs and beginners interested in social media advertising.',
		},

		'Market Research Techniques': {
			category: 'MARKETING',
			duration: '🕛 4 weeks',

			description:
				'Learn how to gather, organise and interpret market information to better understand customers, competitors and business opportunities.',

			learning: [
				'Data collection methods',
				'Market research planning',
				'Competitive analysis',
				'Consumer behaviour',
				'Turning research into useful insights',
			],

			audience:
				'Marketing professionals, business students, entrepreneurs and professionals involved in business research.',
		},
	};

	// program category filter:
	const filters = document.querySelectorAll('.category');
	const cards = document.querySelectorAll('.card');

	filters.forEach((filter) => {
		filter.addEventListener('click', () => {
			filters.forEach((item) => {
				item.classList.remove('active');
			});
			filter.classList.add('active');
			const value = filter.dataset.filter;

			cards.forEach((card) => {
				const show = value === 'all' || card.dataset.category === value;
				card.style.display = show ? '' : 'none';
			});
		});
	});

	// program modal
	const modal = document.getElementById('programmeModal');
	const modalOverlay = document.querySelector('.programme-modal-overlay');
	const modalClose = document.getElementById('modalClose');

	const modalCategory = document.getElementById('modalCategory');
	const modalTitle = document.getElementById('modalTitle');
	const modalDuration = document.getElementById('modalDuration');
	const modalDescription = document.getElementById('modalDescription');
	const modalLearningPoints = document.getElementById('modalLearningPoints');
	const modalAudience = document.getElementById('modalAudience');

	const knowMoreButtons = document.querySelectorAll('.know-more');

	// open modal
	knowMoreButtons.forEach((btn) => {
		btn.addEventListener('click', (event) => {
			event.preventDefault();

			const card = btn.closest('.card');
			const programmeName = card.dataset.programme;
			const programme = programmeData[programmeName];

			if (!programme) {
				console.error(`Programme data not found for: ${programmeName}`);
				return;
			}

			// insert program information
			modalCategory.textContent = programme.category;
			modalTitle.textContent = programmeName;
			modalDuration.textContent = programme.duration;
			modalDescription.textContent = programme.description;
			modalAudience.textContent = programme.audience;

			// insert learning points
			modalLearningPoints.innerHTML = '';
			programme.learning.forEach((point) => {
				const li = document.createElement('li');
				li.textContent = point;
				modalLearningPoints.appendChild(li);
			});

			// show modal
			modal.classList.add('active');
			document.body.style.overflow = 'hidden';
		});
	});

	// close modal
	function closeModal() {
		modal.classList.remove('active');
		document.body.style.overflow = '';
	}

	// close using x btn
	modalClose.addEventListener('click', closeModal);

	//  close when clicking dark overlay
	modalOverlay.addEventListener('click', closeModal);

	// close using Escape key
	document.addEventListener('keydown', (event) => {
		if (event.key === 'Escape' && modal.classList.contains('active')) {
			closeModal();
		}
	});
});
