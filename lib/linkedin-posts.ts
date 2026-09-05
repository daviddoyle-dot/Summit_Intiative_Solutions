export type LinkedInPost = {
  slug: string;
  title: string;
  excerpt: string;
  url: string;
  date: string;
  content: string[];
};

// LinkedIn doesn't offer a public API for pulling a personal profile's
// most-liked posts, so this list is hand-curated rather than auto-fetched.
//
// To feature a post:
//   1. Open the post on David's LinkedIn profile and copy its URL.
//   2. Write a short title, slug, and one-line excerpt summarizing it.
//   3. Paste the full post text into `content` as an array of paragraphs.
//   4. Add (or replace) an entry below.
export const FEATURED_POSTS: LinkedInPost[] = [
  {
    slug: "two-numbers-on-a-dry-erase-board",
    title: "Two Numbers on a Dry-Erase Board",
    excerpt:
      "A battalion commander never said a word — he just wrote two numbers on a dry-erase board. It taught a young lieutenant that a goal only changes behavior once people believe it's real.",
    url: "https://www.linkedin.com/posts/mg-david-doyle_my-battalion-commander-didnt-say-a-word-activity-7488586966402338816-GzZv",
    date: "Aug 2026",
    content: [
      "My battalion commander didn't say a word.",
      "While I was still policing up the remnants of a failed platoon five-mile formation run, he walked into my platoon command post, picked up a marker, and left me a message on my dry erase board.",
      "When I returned a few minutes later, I realized a goal had just become very real.",
      "My morning had started like every other morning in the early 1990s. We stood in formation on a dew-covered field, listened to the morning announcements, saluted the flag during reveille, and executed a right face to step off on a five-mile formation run.",
      "As we started down Tennessee Avenue, a tall, wraith-like figure quietly joined the back of the platoon.",
      "It was our battalion commander.",
      "He didn't say a word. He simply fell in and started running with us.",
      "For a brand-new second lieutenant—a butter bar—a battalion commander was a god-like figure. He wasn't actually God, of course, but from my perspective he occupied a neighboring office. Even in the pre-dawn darkness, I knew exactly who it was, and I also knew this probably wasn't going to end well.",
      "It didn't.",
      "Soldiers began falling out of formation. By the time we returned to the company area, only a fraction of the platoon remained in formation.",
      "I stayed with the remnants of the platoon and watched my battalion commander walk away. He still hadn't said a word.",
      "When I walked into my platoon command post—a glorified closet with a field desk, a rotary phone, and a dry erase board—I immediately recognized his handwriting. In the upper-right corner of my dry erase board were two numbers.",
      "51 — Our run time.\n40 — The division's goal.",
      "The 40 was underlined three times.\nThere was nothing else.",
      "Later that morning, he told my company commander that he would run with my platoon again in forty-five days.",
      "The goal hadn't changed.",
      "My understanding of it had.",
      "Until that morning, the goal belonged to the division. Now it belonged to my platoon. Forty minutes had been a number printed somewhere in a training calendar; now it stared at me every time I walked into my CP.",
      "We became a running platoon and forty-five days later, we crossed the finish line with our battalion commander in just under forty minutes.",
      "I've thought about those two numbers many times over the years. They represented more than a failed five mile run.",
      "Most organizations don't struggle because they lack goals, mission statements, strategic plans, annual objectives, or performance metrics.",
      "Almost every organization has them. They're discussed, briefed, published, and displayed, but they don't change behavior.",
      "Great leaders change that.",
      "They make goals personal.",
      "I've kept a dry erase board in every office I've occupied since that morning—not because of those two numbers, but because every time I look at that board, I'm reminded of something a young lieutenant needed to learn.",
      "Impactful leadership isn't measured by the goals we announce.\nIt's measured by whether the people we lead believe those goals are real.",
    ],
  },
  {
    slug: "the-jelly-belly-dispenser",
    title: "The Jelly Belly Dispenser",
    excerpt:
      "A $60-a-week candy habit in the Pentagon basement became one of the best sources of informal intelligence about what a team was really thinking — and doing.",
    url: "https://www.linkedin.com/posts/mg-david-doyle_i-spent-60-a-week-on-jelly-bellies-in-activity-7501240100421468160-4RaO",
    date: "Sep 3, 2026",
    content: [
      "I spent $60 a week on Jelly Bellies in the basement of the Pentagon.",
      "They gave people a reason to stop by my desk.",
      "Yes, the Pentagon basement is real, and calling it the “bowels of the building” is not too far from the truth. Special badges get you down there, which is warning enough. Once there, you enter a windowless, soul-sucking place with the air-conditioned scent of hard work.",
      "Our joint team communicated and refined strategy and policy options for senior national leaders. Occasionally we'd get a kitchen pass and go “upstairs” to see the reflected daylight of the E Ring or cut through the courtyard to check the weather.",
      "My boss at the time, then-BG Scott Miller, had recently directed the team to reconfigure our workspace. He understood that physical space affects how people work and deliberately shaped the environment around what the organization needed to accomplish. He treated space as a leadership tool.",
      "This wasn't a Google-style beanbag-and-fro-yo redesign. We pulled down the insanely demoralizing cubicle farms and created roughly a football field's worth of open workspace. Computer monitors for all the types of systems had to remain below “name-tape defilade.”",
      "You had to be able to look over your monitor and see other people. No hiding. No walls of personal flair.",
      "I learned from GEN Miller's approach and made one slight adjustment of my own.",
      "I needed to quickly understand our people and what the team was accomplishing. Thanks to my wife's trips to Wegman's—and my pursuit of the perfect Jelly Belly flavor combinations—I developed a technique.",
      "Maybe just a little above name-tape defilade (sorry, boss) I placed a Jelly Belly dispenser on my desk.",
      "People wandered over, sampled the combination of the week, and talked—sometimes about work, sometimes about a problem, sometimes about what they hoped to do with their families if they ever escaped the gravitational pull of the Pentagon basement.",
      "I learned, and I learned fast.",
      "Those informal conversations helped me understand where talent existed, who needed information someone else possessed, and how our work fit together.",
      "The work was hard, and nearly pure sugar, combined with strong coffee, certainly helped.",
      "I took the practice with me. The picture is a smaller bowl that later sat on my desk at Fort Drum as a Brigade Combat Team Commander. There are no pictures of the original; cameras weren't allowed downstairs, and neither were our flip phones—yes, it was a while ago.",
      "Fewer people just wandered into the brigade commander's office, but my staff and subordinate commanders knew the Jelly Bellies were available. The combination of Root Beer, Dr Pepper, Cherry Cola, and Cream Soda usually got the highest marks.",
      "We rightly design organizations around formal ways of exchanging information—meetings, reports, briefings, email, organizational charts.",
      "And, some of what I most needed to know came from people standing at my desk eating Jelly Bellies.",
    ],
  },
  {
    slug: "not-yet-your-problem",
    title: "Not Yet Your Problem",
    excerpt:
      "Commanding JRTC meant diagnosing a new unit's friction every month — often faster than the unit itself could, not by being smarter, but by not living inside the problem.",
    url: "https://www.linkedin.com/posts/mg-david-doyle_leadership-teamwork-coaching-activity-7477789601189892097-U7xQ",
    date: "Jul 2026",
    content: [
      "“That's somebody else's problem.” I heard that phrase hundreds of times during my career.",
      "Sometimes it was true.\nMore often, it wasn't.",
      "Some of the best leaders I have known developed a habit of understanding other people's problems—not because they owned them, but because their own success often depended on them.",
      "I learned that lesson while commanding the Joint Readiness Training Center (JRTC) at Fort Polk.",
      "Every month, we worked with a new organization preparing for deployment.",
      "We also routinely trained and exchanged ideas with leaders from partner nations. The uniforms, languages, and cultures were often different, but the leadership challenge was remarkably similar.",
      "Leave the organization better than you found it.",
      "That meant resisting one of the easiest mistakes a coach, consultant, or leader can make:",
      "Deciding too quickly what someone else's problem is.",
      "Instead, we spent time understanding how they saw the world.\nWe listened.\nWe observed.",
      "Then we compared what they told us, what we observed, and what dozens of previous organizations had taught us.",
      "Within days, we often understood a unit's challenges differently than they did.",
      "Not because we were smarter.",
      "Because we weren't living inside the problem.",
      "We could see friction between staffs, communication breakdowns, unintended consequences, and gaps between intent and execution that had quietly become accepted as normal.",
      "If we misdiagnosed the problem, we had little value to offer.\nIf we relied only on our previous experience, we had little value to offer.\nIf we failed to communicate our observations with credibility and evidence, we had little value to offer.",
      "The photo below was taken during one of those exchanges with senior leaders from the Colombian Army. Although the uniforms were different, the leadership challenge was remarkably familiar: before you can help another organization improve, you have to understand how it sees the world.",
      "JRTC was an unusual organization because helping other organizations improve was our mission.",
      "But the lesson applies everywhere.\nEvery organization creates work for someone else.\nEvery decision creates friction—or removes it.",
      "The best leaders occasionally step outside their own swim lane long enough to understand how their work affects the rest of the system.",
      "That doesn't mean turning the organization into a five-year-old soccer match where everyone chases the same ball. Clear roles, disciplined processes, and accountability still matter.",
      "But so does curiosity.",
      "Sometimes the fastest way to improve your own organization is to spend time understanding someone else's.",
      "The organizations that improve fastest are often the ones most willing to learn from problems that aren't yet their own.",
    ],
  },
  {
    slug: "your-calendar-is-your-battle-rhythm",
    title: "Your Calendar Is Your Battle Rhythm",
    excerpt:
      "Leaders often schedule meetings. The best leaders schedule thinking — and a calendar, examined honestly, is a statement of what you actually value.",
    url: "https://www.linkedin.com/posts/mg-david-doyle_leadership-dday-battlerhythm-activity-7469742027950231554-OpYV",
    date: "Jul 2026",
    content: [
      "Leaders often schedule meetings. The best leaders schedule thinking.",
      "This week marks the anniversary of the D-Day landings in Normandy.",
      "Every year, the anniversary causes me to think about time.",
      "Not just the passage of time, but how we choose to use it.\nAs I prepared remarks for my retirement ceremony, I found myself reflecting on a simple realization:",
      "You stop counting deployments. You start counting birthdays.\nYou stop counting assignments. You start counting anniversaries.\nYou stop counting promotions. You start counting moments.",
      "And that's when you realize that how we use our time ultimately becomes our life.",
      "Two leadership thinkers capture this idea well:",
      "My friend Jamie Efaw observed that if you want to know what someone prioritizes, don't listen to their words, examine their calendar.",
      "Joseph McCormack's work on Quiet reinforced a second lesson:\nIf thinking is important, it must be protected.",
      "I have found both observations to be remarkably accurate.",
      "For years, I paid close attention to how leaders allocated their time.\nEventually, I began applying the same principle to myself.\nNot perfectly.\nAnd certainly not early enough.",
      "Date nights with Renee went on my Outlook calendar. Travel to children's events went on my Outlook calendar. Grandchildren's activities went on my Outlook calendar.",
      "Not because I needed reminders. Because I needed visibility.\nIf family mattered, family deserved protected time.\nI also wanted my teammates to see that protecting time for family wasn't just acceptable—it was important.",
      "I began protecting blocks of quiet time as well. Very early. Sometimes ridiculously early.",
      "No meetings.\nNo calls.\nNo interruptions.",
      "Just time to think, read, write, solve problems, and make sense of complexity.",
      "The same lesson applies to organizations.\nIf innovation is a priority, leaders must protect time for innovation.\nIf reflection is a priority, leaders must protect time for reflection.\nOtherwise, urgency consumes everything - the Tyranny of the Urgent is real.",
      "This idea eventually became part of my thinking on organizational effectiveness. An organization's battle rhythm is not simply a meeting schedule. It is a statement of priorities.",
      "The same is true for individuals.\nOur calendars are battle rhythms for our lives.\nThey reveal what we value.\nThey expose our tradeoffs.\nAnd over time, they shape who we become.\nThe attached photo includes three generations of my family at my retirement ceremony.\nLooking at it, I am reminded that calendars and battle rhythms ultimately lead somewhere. They become relationships. They become memories.\nThey become a life.",
      "The heroes who landed on the beaches of Normandy understood something many of us eventually learn:\nTime is finite.\nThe question is not whether we are spending it.\nThe question is whether we are spending it well.\nTake a look at your calendar.\nWhat does it say about your priorities?",
      "Would the people you love agree?",
    ],
  },
];
