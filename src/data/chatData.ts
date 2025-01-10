import { ChatUser, MessageTemplate } from '@/types/chat';

// Update the ChatUser type in src/types/chat.ts first:
type UserCategory = 'fan' | 'critic' | 'celebrity' | 'media' | 'expert';

export interface ChatUser {
  id: string;
  name: string;
  avatar: string;
  isVerified?: boolean;
  category: UserCategory;
}

// Generate 50 users with different categories
const generateUsers = (): ChatUser[] => {
  const categories: UserCategory[] = ['fan', 'critic', 'celebrity', 'media', 'expert'];
  const users: ChatUser[] = [];

  // Predefined verified users (about 15)
  const verifiedUsers = [
    { name: 'Entertainment_Weekly', category: 'media' },
    { name: 'MovieCritic_Pro', category: 'critic' },
    { name: 'CelebNews', category: 'media' },
    { name: 'AwardsExpert', category: 'expert' },
    { name: 'ShowBizInsider', category: 'media' },
    { name: 'FilmCriticGuild', category: 'critic' },
    { name: 'VotingAnalyst', category: 'expert' },
    { name: 'AwardsCeremony', category: 'media' },
    { name: 'IndustryInsider', category: 'expert' },
    { name: 'TalentScout', category: 'expert' },
    { name: 'CelebWatch', category: 'media' },
    { name: 'ArtisticReview', category: 'critic' },
    { name: 'VotingCommittee', category: 'expert' },
    { name: 'EntertainmentToday', category: 'media' },
    { name: 'AwardsSeason', category: 'media' }
  ].map((user, index) => ({
    id: (index + 1).toString(),
    name: user.name,
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${index + 1}`,
    isVerified: true,
    category: user.category as UserCategory
  }));

  users.push(...verifiedUsers);

  // Generate remaining regular users
  const fanNames = ['SuperFan', 'MusicLover', 'MovieBuff', 'ArtEnthusiast', 'ShowFanatic', 'VotingFan'];
  const remainingCount = 50 - verifiedUsers.length;

  for (let i = 0; i < remainingCount; i++) {
    const nameBase = fanNames[Math.floor(Math.random() * fanNames.length)];
    const randomNum = Math.floor(Math.random() * 9999);
    const category = categories[Math.floor(Math.random() * 3)]; // More weight to fan/critic categories

    users.push({
      id: (i + verifiedUsers.length + 1).toString(),
      name: `${nameBase}_${randomNum}`,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${i + verifiedUsers.length + 1}`,
      isVerified: false,
      category
    });
  }

  return users;
};

export const allUsers = generateUsers();

// Function to get random active users with dynamic count
export const getRandomActiveUsers = () => {
  // Get a random number between 25-40 for active users
  const activeCount = Math.floor(Math.random() * 16) + 25; // 25-40 active users
  const shuffled = [...allUsers].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, activeCount);
};



export const messageTemplates: MessageTemplate[] = [
    // Existing templates
    {
      text: "{nominee}'s performance in the {category} category this year was incredible! 🌟",
      userTypes: ['fan', 'critic'],
      requiresNominee: true,
      requiresCategory: true
    },
    {
      text: "The way {nominee} has dominated {category} this year is amazing!",
      userTypes: ['fan', 'critic'],
      requiresNominee: true,
      requiresCategory: true
    },
    {
      text: "Just voted for {nominee} 🎉",
      userTypes: ['fan'],
      requiresNominee: true
    },
    {
      text: "Can't wait to see {nominee} at the awards! 🤩",
      userTypes: ['fan'],
      requiresNominee: true
    },
    {
      text: "The {category} category is so competitive this year! 🔥",
      userTypes: ['critic', 'analyst'],
      requiresCategory: true
    },
    {
      text: "Who's everyone rooting for in {category}?",
      userTypes: ['fan'],
      requiresCategory: true
    },
    {
      text: "{nominee} has brought something fresh to {category} this year",
      userTypes: ['critic', 'analyst'],
      requiresNominee: true,
      requiresCategory: true
    },
    {
      text: "The talent in {category} this year is unmatched!",
      userTypes: ['critic'],
      requiresCategory: true
    },
    {
      text: "{nominee} deserves recognition in {category} for their consistency",
      userTypes: ['fan', 'critic'],
      requiresNominee: true,
      requiresCategory: true
    },
    {
      text: "Been following {nominee}'s journey in {category} all year! 📈",
      userTypes: ['fan'],
      requiresNominee: true,
      requiresCategory: true
    },
    {
      text: "The impact {nominee} has had on {category} is undeniable",
      userTypes: ['critic', 'analyst'],
      requiresNominee: true,
      requiresCategory: true
    },
    {
      text: "My vote in {category} definitely goes to {nominee}! 🗳️",
      userTypes: ['fan'],
      requiresNominee: true,
      requiresCategory: true
    },
    {
      text: "The numbers for {nominee} in the {category} category are impressive",
      userTypes: ['analyst'],
      requiresNominee: true,
      requiresCategory: true
    },
  
    // New templates
    {
      text: "{nominee} has truly redefined what it means to excel in {category}! 🚀",
      userTypes: ['critic', 'analyst'],
      requiresNominee: true,
      requiresCategory: true
    },
    {
      text: "The {category} category wouldn't be the same without {nominee}'s contributions!",
      userTypes: ['fan', 'critic'],
      requiresNominee: true,
      requiresCategory: true
    },
    {
      text: "{nominee} is a game-changer in {category}, and everyone knows it! 🏆",
      userTypes: ['fan', 'critic'],
      requiresNominee: true,
      requiresCategory: true
    },
    {
      text: "Rooting for {nominee} all the way! Let's go! 💪",
      userTypes: ['fan'],
      requiresNominee: true
    },
    {
      text: "{nominee} is a true inspiration! Can't wait to see what's next for them. 🌟",
      userTypes: ['fan'],
      requiresNominee: true
    },
    {
      text: "Everyone's talking about {nominee}, and for good reason!",
      userTypes: ['fan', 'critic'],
      requiresNominee: true
    },
    {
      text: "The {category} category is absolutely stacked this year! Who will come out on top? 🤔",
      userTypes: ['fan', 'critic'],
      requiresCategory: true
    },
    {
      text: "This year's {category} category is a masterclass in talent and creativity.",
      userTypes: ['critic', 'analyst'],
      requiresCategory: true
    },
    {
      text: "The {category} category is where the real magic happens! ✨",
      userTypes: ['fan'],
      requiresCategory: true
    },
    {
      text: "I've been a fan of {nominee} since day one! So proud of their journey in {category}. 🥹",
      userTypes: ['fan'],
      requiresNominee: true,
      requiresCategory: true
    },
    {
      text: "{nominee} in {category}? Absolutely iconic! 🔥",
      userTypes: ['fan'],
      requiresNominee: true,
      requiresCategory: true
    },
    {
      text: "No one deserves this more than {nominee} in {category}! 🙌",
      userTypes: ['fan'],
      requiresNominee: true,
      requiresCategory: true
    },
    {
      text: "Just cast my vote for {nominee} in {category}! Fingers crossed! 🤞",
      userTypes: ['fan'],
      requiresNominee: true,
      requiresCategory: true
    },
    {
      text: "The stats don't lie—{nominee} is dominating the {category} category! 📊",
      userTypes: ['analyst'],
      requiresNominee: true,
      requiresCategory: true
    },
    {
      text: "Voting for {nominee} in {category} was a no-brainer! 🗳️",
      userTypes: ['fan'],
      requiresNominee: true,
      requiresCategory: true
    },
    {
      text: "{nominee}'s impact on {category} is backed by the numbers—undeniable! 📈",
      userTypes: ['analyst'],
      requiresNominee: true,
      requiresCategory: true
    },
    {
      text: "The data shows that {nominee} is a frontrunner in {category} this year.",
      userTypes: ['analyst'],
      requiresNominee: true,
      requiresCategory: true
    },
    {
      text: "Analyzing the trends, {nominee} is a standout in {category}.",
      userTypes: ['analyst'],
      requiresNominee: true,
      requiresCategory: true
    },
    {
      text: "If {nominee} doesn't win {category}, I'm rioting! 😤",
      userTypes: ['fan'],
      requiresNominee: true,
      requiresCategory: true
    },
    {
      text: "The {category} category is giving me life this year! 😍",
      userTypes: ['fan'],
      requiresCategory: true
    },
    {
      text: "{nominee} in {category}? That's a match made in heaven! 👼",
      userTypes: ['fan'],
      requiresNominee: true,
      requiresCategory: true
    },
    {
      text: "{nominee}'s journey in {category} is a testament to hard work and dedication. 💪",
      userTypes: ['fan', 'critic'],
      requiresNominee: true,
      requiresCategory: true
    },
    {
      text: "The {category} category reminds us why we love this industry so much! ❤️",
      userTypes: ['fan'],
      requiresCategory: true
    },
    {
      text: "{nominee} is proof that dreams really do come true in {category}! 🌠",
      userTypes: ['fan'],
      requiresNominee: true,
      requiresCategory: true
    },
    {
      text: "This year's {category} category is absolutely electric! ⚡",
      userTypes: ['fan', 'critic'],
      requiresCategory: true
    },
    {
      text: "The energy around {nominee} in {category} is unreal! 🎉",
      userTypes: ['fan'],
      requiresNominee: true,
      requiresCategory: true
    },
    {
      text: "I can't wait to see who takes home the award for {category}! 🏆",
      userTypes: ['fan'],
      requiresCategory: true
    },
 // New templates
 {
    text: "{nominee} is the heart and soul of {category} this year. Pure magic! ✨",
    userTypes: ['fan', 'critic'],
    requiresNominee: true,
    requiresCategory: true
  },
  {
    text: "If {nominee} doesn't win {category}, I’m moving to another planet. 🚀",
    userTypes: ['fan'],
    requiresNominee: true,
    requiresCategory: true
  },
  {
    text: "The data proves it: {nominee} is the MVP of {category}. 📊",
    userTypes: ['analyst'],
    requiresNominee: true,
    requiresCategory: true
  },
  {
    text: "Voting for {nominee} in {category} feels like voting for sunshine on a rainy day. 🌦️",
    userTypes: ['fan'],
    requiresNominee: true,
    requiresCategory: true
  },
  {
    text: "{nominee} in {category}? That’s not just talent—that’s a whole vibe. 🎶",
    userTypes: ['fan'],
    requiresNominee: true,
    requiresCategory: true
  },
  {
    text: "The {category} category is basically {nominee}'s world, and we’re just living in it. 🌎",
    userTypes: ['fan', 'critic'],
    requiresNominee: true,
    requiresCategory: true
  },
  {
    text: "I’ve watched {nominee} in {category} 47 times this year. No regrets. 🍿",
    userTypes: ['fan'],
    requiresNominee: true,
    requiresCategory: true
  },
  {
    text: "The industry needs more moments like {nominee} in {category}. Iconic. 🖼️",
    userTypes: ['critic', 'analyst'],
    requiresNominee: true,
    requiresCategory: true
  },
  {
    text: "If {nominee} doesn’t win {category}, I’m blaming the algorithm. 🤖",
    userTypes: ['fan'],
    requiresNominee: true,
    requiresCategory: true
  },
  {
    text: "The {category} category is a rollercoaster this year, and {nominee} is the MVP. 🎢",
    userTypes: ['fan', 'critic'],
    requiresNominee: true,
    requiresCategory: true
  },
  {
    text: "Just saw {nominee}’s work in {category}. My mind is officially blown. 🤯",
    userTypes: ['fan'],
    requiresNominee: true,
    requiresCategory: true
  },
  {
    text: "The numbers don’t lie: {nominee} is carrying {category} on their back. 📈",
    userTypes: ['analyst'],
    requiresNominee: true,
    requiresCategory: true
  },
  {
    text: "Voting for {nominee} in {category} is the easiest decision I’ve made all year. ✅",
    userTypes: ['fan'],
    requiresNominee: true,
    requiresCategory: true
  },
  {
    text: "{nominee} in {category} is like a fine wine—only getting better with time. 🍷",
    userTypes: ['critic', 'analyst'],
    requiresNominee: true,
    requiresCategory: true
  },
  {
    text: "The {category} category is a battlefield, and {nominee} is the undisputed champion. ⚔️",
    userTypes: ['fan', 'critic'],
    requiresNominee: true,
    requiresCategory: true
  },
  {
    text: "If {nominee} doesn’t win {category}, I’m starting a petition. 📜",
    userTypes: ['fan'],
    requiresNominee: true,
    requiresCategory: true
  },
  {
    text: "The industry owes {nominee} a standing ovation for their work in {category}. 👏",
    userTypes: ['critic', 'analyst'],
    requiresNominee: true,
    requiresCategory: true
  },
  {
    text: "The {category} category is a masterpiece, and {nominee} is the artist. 🎨",
    userTypes: ['fan', 'critic'],
    requiresNominee: true,
    requiresCategory: true
  },
  {
    text: "I’d vote for {nominee} in {category} even if it cost me my Wi-Fi. 📶",
    userTypes: ['fan'],
    requiresNominee: true,
    requiresCategory: true
  },
  {
    text: "The stats for {nominee} in {category} are so good, they’re almost illegal. 🚨",
    userTypes: ['analyst'],
    requiresNominee: true,
    requiresCategory: true
  },
  {
    text: "{nominee} in {category} is the definition of ‘iconic.’ Period. 💅",
    userTypes: ['fan', 'critic'],
    requiresNominee: true,
    requiresCategory: true
  },
  {
    text: "The {category} category is a vibe, and {nominee} is the DJ. 🎧",
    userTypes: ['fan'],
    requiresNominee: true,
    requiresCategory: true
  },
  {
    text: "If {nominee} doesn’t win {category}, I’m throwing my TV out the window. 📺",
    userTypes: ['fan'],
    requiresNominee: true,
    requiresCategory: true
  },
  {
    text: "The industry needs to take notes from {nominee} in {category}. 📝",
    userTypes: ['critic', 'analyst'],
    requiresNominee: true,
    requiresCategory: true
  },
  {
    text: "The {category} category is a treasure chest, and {nominee} is the gold. 💰",
    userTypes: ['fan', 'critic'],
    requiresNominee: true,
    requiresCategory: true
  },
  {
    text: "Voting for {nominee} in {category} is my civic duty. 🗳️",
    userTypes: ['fan'],
    requiresNominee: true,
    requiresCategory: true
  },
  {
    text: "The numbers for {nominee} in {category} are giving me life. 📊",
    userTypes: ['analyst'],
    requiresNominee: true,
    requiresCategory: true
  },
  {
    text: "{nominee} in {category} is the serotonin boost we all needed. 🌈",
    userTypes: ['fan'],
    requiresNominee: true,
    requiresCategory: true
  },
  {
    text: "The {category} category is a symphony, and {nominee} is the conductor. 🎼",
    userTypes: ['fan', 'critic'],
    requiresNominee: true,
    requiresCategory: true
  },
  {
    text: "If {nominee} doesn’t win {category}, I’m blaming Mercury retrograde. 🌌",
    userTypes: ['fan'],
    requiresNominee: true,
    requiresCategory: true
  },
  {
    text: "The industry will be talking about {nominee} in {category} for decades. 🕰️",
    userTypes: ['critic', 'analyst'],
    requiresNominee: true,
    requiresCategory: true
  },
  {
    text: "The {category} category is a firework show, and {nominee} is the grand finale. 🎆",
    userTypes: ['fan', 'critic'],
    requiresNominee: true,
    requiresCategory: true
  },
  {
    text: "Voting for {nominee} in {category} is the highlight of my year. 🌟",
    userTypes: ['fan'],
    requiresNominee: true,
    requiresCategory: true
  },
  {
    text: "The stats for {nominee} in {category} are so good, they should be framed. 🖼️",
    userTypes: ['analyst'],
    requiresNominee: true,
    requiresCategory: true
  },
  {
    text: "{nominee} in {category} is the kind of excellence that gives me goosebumps. 🐥",
    userTypes: ['fan', 'critic'],
    requiresNominee: true,
    requiresCategory: true
  },
  {
    text: "The {category} category is a masterpiece, and {nominee} is the brushstroke. 🖌️",
    userTypes: ['fan', 'critic'],
    requiresNominee: true,
    requiresCategory: true
  },
  {
    text: "If {nominee} doesn’t win {category}, I’m writing a strongly worded letter. ✍️",
    userTypes: ['fan'],
    requiresNominee: true,
    requiresCategory: true
  },
  {
    text: "The industry needs to give {nominee} in {category} their flowers. 🌸",
    userTypes: ['critic', 'analyst'],
    requiresNominee: true,
    requiresCategory: true
  },
  {
    text: "The {category} category is a celebration, and {nominee} is the guest of honor. 🎉",
    userTypes: ['fan', 'critic'],
    requiresNominee: true,
    requiresCategory: true
  },
  {
    text: "Voting for {nominee} in {category} is my love language. 💌",
    userTypes: ['fan'],
    requiresNominee: true,
    requiresCategory: true
  },
  {
    text: "The stats for {nominee} in {category} are so impressive, they’re breaking the scale. ⚖️",
    userTypes: ['analyst'],
    requiresNominee: true,
    requiresCategory: true
  },
  {
    text: "{nominee} in {category} is the kind of brilliance that makes you believe in magic. 🪄",
    userTypes: ['fan', 'critic'],
    requiresNominee: true,
    requiresCategory: true
  },
  {
    text: "The {category} category is a canvas, and {nominee} is the masterpiece. 🎨",
    userTypes: ['fan', 'critic'],
    requiresNominee: true,
    requiresCategory: true
  },
  {
    text: "If {nominee} doesn’t win {category}, I’m starting a support group. 🫂",
    userTypes: ['fan'],
    requiresNominee: true,
    requiresCategory: true
  },
  {
    text: "The industry needs to give {nominee} in {category} a lifetime achievement award. 🏅",
    userTypes: ['critic', 'analyst'],
    requiresNominee: true,
    requiresCategory: true
  },
  {
    text: "The {category} category is a festival, and {nominee} is the headliner. 🎤",
    userTypes: ['fan', 'critic'],
    requiresNominee: true,
    requiresCategory: true
  },
  {
    text: "Voting for {nominee} in {category} is my superpower. 💥",
    userTypes: ['fan'],
    requiresNominee: true,
    requiresCategory: true
  },
  {
    text: "The stats for {nominee} in {category} are so good, they’re rewriting the rules. 📜",
    userTypes: ['analyst'],
    requiresNominee: true,
    requiresCategory: true
  },
  {
    text: "{nominee} in {category} is the kind of excellence that makes you want to stand up and cheer. 🎉",
    userTypes: ['fan', 'critic'],
    requiresNominee: true,
    requiresCategory: true
  },
  {
    text: "I voted for {nominee} in {category} just to see the world burn. 🔥",
    userTypes: ['fan'],
    requiresNominee: true,
    requiresCategory: true
  },
  {
    text: "If {nominee} wins {category}, I’m throwing a party in their honor. If they lose, I’m throwing a party anyway. 🎉",
    userTypes: ['fan'],
    requiresNominee: true,
    requiresCategory: true
  },
  {
    text: "I’m rooting for {nominee} in {category} purely for the chaos. Let’s go! 🌪️",
    userTypes: ['fan'],
    requiresNominee: true,
    requiresCategory: true
  },
  {
    text: "The {category} category is a mess, and I’m here for it. Go {nominee}! 🍿",
    userTypes: ['fan'],
    requiresNominee: true,
    requiresCategory: true
  },
  {
    text: "I voted for {nominee} in {category} just to make my friends mad. 😈",
    userTypes: ['fan'],
    requiresNominee: true,
    requiresCategory: true
  },
  {
    text: "If {nominee} wins {category}, I’m taking full credit. You’re welcome. 😎",
    userTypes: ['fan'],
    requiresNominee: true,
    requiresCategory: true
  },
  {
    text: "The {category} category is a circus, and {nominee} is the ringmaster. Let’s embrace the chaos! 🎪",
    userTypes: ['fan'],
    requiresNominee: true,
    requiresCategory: true
  },
  {
    text: "I’m only voting for {nominee} in {category} because their name is fun to say. Try it: {nominee}. 😂",
    userTypes: ['fan'],
    requiresNominee: true,
    requiresCategory: true
  },
  {
    text: "If {nominee} wins {category}, I’m framing it as a personal victory. 🖼️",
    userTypes: ['fan'],
    requiresNominee: true,
    requiresCategory: true
  },
  {
    text: "The {category} category is a dumpster fire, and {nominee} is my favorite flame. 🔥",
    userTypes: ['fan'],
    requiresNominee: true,
    requiresCategory: true
  },
  {
    text: "I’m voting for {nominee} in {category} just to see if the universe is paying attention. 🌌",
    userTypes: ['fan'],
    requiresNominee: true,
    requiresCategory: true
  },
  {
    text: "If {nominee} wins {category}, I’m buying a lottery ticket. 🎫",
    userTypes: ['fan'],
    requiresNominee: true,
    requiresCategory: true
  },
  {
    text: "The {category} category is a trainwreck, and {nominee} is my favorite passenger. 🚂",
    userTypes: ['fan'],
    requiresNominee: true,
    requiresCategory: true
  },
  {
    text: "I’m voting for {nominee} in {category} purely for the memes. Let’s make it happen. 🐸",
    userTypes: ['fan'],
    requiresNominee: true,
    requiresCategory: true
  },
  {
    text: "If {nominee} wins {category}, I’m starting a fan club. If they lose, I’m starting a conspiracy theory. 🕵️",
    userTypes: ['fan'],
    requiresNominee: true,
    requiresCategory: true
  },
  {
    text: "The {category} category is a joke, and {nominee} is the punchline. Let’s laugh together. 😂",
    userTypes: ['fan'],
    requiresNominee: true,
    requiresCategory: true
  },
  {
    text: "I’m voting for {nominee} in {category} just to see if the internet explodes. 💥",
    userTypes: ['fan'],
    requiresNominee: true,
    requiresCategory: true
  },
  {
    text: "If {nominee} wins {category}, I’m writing a book about it. If they lose, I’m writing a fanfiction. 📚",
    userTypes: ['fan'],
    requiresNominee: true,
    requiresCategory: true
  },
  {
    text: "The {category} category is a soap opera, and {nominee} is my favorite character. 🍿",
    userTypes: ['fan'],
    requiresNominee: true,
    requiresCategory: true
  },
  {
    text: "I’m voting for {nominee} in {category} just to see if the universe rewards chaos. 🌪️",
    userTypes: ['fan'],
    requiresNominee: true,
    requiresCategory: true
  },
  {
    text: "If {nominee} wins {category}, I’m throwing a parade. If they lose, I’m throwing shade. 🎉",
    userTypes: ['fan'],
    requiresNominee: true,
    requiresCategory: true
  },
  {
    text: "The {category} category is a rollercoaster, and {nominee} is my favorite loop-de-loop. 🎢",
    userTypes: ['fan'],
    requiresNominee: true,
    requiresCategory: true
  },
  {
    text: "I’m voting for {nominee} in {category} just to see if the world is ready for greatness. 🌍",
    userTypes: ['fan'],
    requiresNominee: true,
    requiresCategory: true
  },
  {
    text: "If {nominee} wins {category}, I’m taking a victory lap. If they lose, I’m taking a nap. 🏃‍♂️",
    userTypes: ['fan'],
    requiresNominee: true,
    requiresCategory: true
  },
  {
    text: "The {category} category is a hot mess, and {nominee} is my favorite disaster. 🔥",
    userTypes: ['fan'],
    requiresNominee: true,
    requiresCategory: true
  },
  {
    text: "I’m voting for {nominee} in {category} just to see if the stars align. ✨",
    userTypes: ['fan'],
    requiresNominee: true,
    requiresCategory: true
  },
  {
    text: "If {nominee} wins {category}, I’m throwing confetti. If they lose, I’m throwing hands. 🎊",
    userTypes: ['fan'],
    requiresNominee: true,
    requiresCategory: true
  },
  {
    text: "The {category} category is a circus, and {nominee} is my favorite clown. 🤡",
    userTypes: ['fan'],
    requiresNominee: true,
    requiresCategory: true
  },
  {
    text: "I’m voting for {nominee} in {category} just to see if the universe has a sense of humor. 😂",
    userTypes: ['fan'],
    requiresNominee: true,
    requiresCategory: true
  },
  {
    text: "If {nominee} wins {category}, I’m throwing a party. If they lose, I’m throwing shade. 🎉",
    userTypes: ['fan'],
    requiresNominee: true,
    requiresCategory: true
  },

  {
    text: "{nominee} in {category} is good, but let’s not pretend they’re the best thing since sliced bread. 🍞",
    userTypes: ['critic', 'analyst'],
    requiresNominee: true,
    requiresCategory: true
  },
  {
    text: "I appreciate {nominee}’s work in {category}, but they’re not quite award-worthy this year. 🤔",
    userTypes: ['critic', 'analyst'],
    requiresNominee: true,
    requiresCategory: true
  },
  {
    text: "{nominee} in {category} is overhyped. Let’s give someone else a chance. 🙃",
    userTypes: ['critic', 'analyst'],
    requiresNominee: true,
    requiresCategory: true
  },
  {
    text: "I respect {nominee}, but their work in {category} this year felt a bit... meh. 🫤",
    userTypes: ['critic', 'analyst'],
    requiresNominee: true,
    requiresCategory: true
  },
  {
    text: "{nominee} in {category} is talented, but they’ve had better years. Just saying. 🤷‍♂️",
    userTypes: ['critic', 'analyst'],
    requiresNominee: true,
    requiresCategory: true
  },
  {
    text: "I’m not sure {nominee} deserves the hype in {category} this year. Let’s be real. 🧐",
    userTypes: ['critic', 'analyst'],
    requiresNominee: true,
    requiresCategory: true
  },
  {
    text: "{nominee} in {category} is good, but they’re not exactly groundbreaking. 🌱",
    userTypes: ['critic', 'analyst'],
    requiresNominee: true,
    requiresCategory: true
  },
  {
    text: "I like {nominee}, but their work in {category} this year didn’t blow me away. 💨",
    userTypes: ['critic', 'analyst'],
    requiresNominee: true,
    requiresCategory: true
  },
  {
    text: "{nominee} in {category} is fine, but let’s not pretend they’re reinventing the wheel. 🛞",
    userTypes: ['critic', 'analyst'],
    requiresNominee: true,
    requiresCategory: true
  },
  {
    text: "I’m not convinced {nominee} deserves the win in {category}. There are better options. 🤨",
    userTypes: ['critic', 'analyst'],
    requiresNominee: true,
    requiresCategory: true
  },
  {
    text: "{nominee} in {category} is talented, but their performance this year felt a bit... safe. 🛡️",
    userTypes: ['critic', 'analyst'],
    requiresNominee: true,
    requiresCategory: true
  },
  {
    text: "I respect {nominee}, but their work in {category} this year didn’t leave a lasting impression. 🫥",
    userTypes: ['critic', 'analyst'],
    requiresNominee: true,
    requiresCategory: true
  },
  {
    text: "{nominee} in {category} is good, but they’re not the standout everyone claims they are. 🌟",
    userTypes: ['critic', 'analyst'],
    requiresNominee: true,
    requiresCategory: true
  },
  {
    text: "I’m not saying {nominee} is bad in {category}, but they’re definitely not the best. 🥇",
    userTypes: ['critic', 'analyst'],
    requiresNominee: true,
    requiresCategory: true
  },
  {
    text: "{nominee} in {category} is solid, but they’re not exactly pushing boundaries. 🚧",
    userTypes: ['critic', 'analyst'],
    requiresNominee: true,
    requiresCategory: true
  },
  {
    text: "I like {nominee}, but their work in {category} this year felt a bit... predictable. 🎲",
    userTypes: ['critic', 'analyst'],
    requiresNominee: true,
    requiresCategory: true
  },
  {
    text: "{nominee} in {category} is talented, but they’re not the game-changer everyone thinks they are. 🎮",
    userTypes: ['critic', 'analyst'],
    requiresNominee: true,
    requiresCategory: true
  },
  {
    text: "I’m not sure {nominee} deserves all the praise they’re getting in {category}. Let’s keep it real. 🧐",
    userTypes: ['critic', 'analyst'],
    requiresNominee: true,
    requiresCategory: true
  },
  {
    text: "{nominee} in {category} is good, but they’re not exactly setting the world on fire. 🔥",
    userTypes: ['critic', 'analyst'],
    requiresNominee: true,
    requiresCategory: true
  },
  {
    text: "I respect {nominee}, but their work in {category} this year didn’t wow me. 🤷‍♀️",
    userTypes: ['critic', 'analyst'],
    requiresNominee: true,
    requiresCategory: true
  },
  {
    text: "{nominee} in {category} is fine, but they’re not the revolutionary talent everyone claims. 🌍",
    userTypes: ['critic', 'analyst'],
    requiresNominee: true,
    requiresCategory: true
  },
  {
    text: "I’m not saying {nominee} is bad in {category}, but they’re definitely not the GOAT. 🐐",
    userTypes: ['critic', 'analyst'],
    requiresNominee: true,
    requiresCategory: true
  },
  {
    text: "{nominee} in {category} is decent, but they’re not exactly raising the bar. 📊",
    userTypes: ['critic', 'analyst'],
    requiresNominee: true,
    requiresCategory: true
  },
  {
    text: "I like {nominee}, but their work in {category} this year felt a bit... underwhelming. 🫤",
    userTypes: ['critic', 'analyst'],
    requiresNominee: true,
    requiresCategory: true
  },
  {
    text: "{nominee} in {category} is talented, but they’re not the trailblazer everyone thinks. 🚶‍♂️",
    userTypes: ['critic', 'analyst'],
    requiresNominee: true,
    requiresCategory: true
  },
  {
    text: "I’m not sure {nominee} deserves all the hype in {category}. Let’s keep it balanced. ⚖️",
    userTypes: ['critic', 'analyst'],
    requiresNominee: true,
    requiresCategory: true
  },
  {
    text: "{nominee} in {category} is good, but they’re not exactly rewriting the rulebook. 📖",
    userTypes: ['critic', 'analyst'],
    requiresNominee: true,
    requiresCategory: true
  },
  {
    text: "I respect {nominee}, but their work in {category} this year didn’t leave me speechless. 🗣️",
    userTypes: ['critic', 'analyst'],
    requiresNominee: true,
    requiresCategory: true
  },
  {
    text: "{nominee} in {category} is fine, but they’re not the groundbreaking talent everyone claims. 🌱",
    userTypes: ['critic', 'analyst'],
    requiresNominee: true,
    requiresCategory: true
  },
  {
    text: "I’m not saying {nominee} is bad in {category}, but they’re definitely not the MVP. 🏆",
    userTypes: ['critic', 'analyst'],
    requiresNominee: true,
    requiresCategory: true
  }
  
  ];