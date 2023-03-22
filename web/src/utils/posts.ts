export const examplePosts = [
  {
    text: "Just tried to make my bed and accidentally created a fort. #adultingfail",
  },
  {
    text: "Does anyone else get excited when they see their favorite snack at the grocery store? No? Just me then.",
  },
  {
    text: "I think I need a 'Do Not Disturb' sign for my brain. It keeps coming up with crazy ideas at the worst times.",
  },
  {
    text: 'Just realized that "bae" stands for "before anyone else" and not "bacon and eggs". My breakfast game has been strong though.',
  },
  {
    text: `Sometimes I wonder if aliens have social media and if they're just scrolling through our posts like "what even is this species?"`,
  },
  {
    text: "Does anyone else feel like they need a nap after taking a shower? Or is it just me?",
  },
  {
    text: "I have a love-hate relationship with my phone. It keeps me connected to the world, but also to all the notifications I'm trying to ignore.",
  },
  {
    text: `You know you're getting old when you start saying "back in my day" and it actually refers to a time period that most people can't remember.`,
  },
  {
    text: "It's amazing how much we can accomplish when we procrastinate. Suddenly, cleaning the house seems like a great idea compared to finishing that project.",
  },
  {
    text: "I just realized that I've been using the same password for everything and it's my dog's name. Sorry, Fido, you're not as secure as I thought.",
  },
  {
    text: "Do you ever think about how weird it is that we drink the milk of another species? Humans are strange.",
  },
  {
    text: "I wish I could wear a cape to work and still be taken seriously. Superhero vibes, anyone?",
  },
  {
    text: "Sometimes I feel like my phone is judging me for how much time I spend on social media. Sorry, not sorry.",
  },
  {
    text: "If you're ever feeling down, just remember that somewhere out there, there's a pug wearing a tutu and living its best life.",
  },
  {
    text: "Has anyone else ever tried to hold a sneeze and ended up sounding like a dying seal? No? Just me then.",
  },
  {
    text: "I'm convinced that the only way to get motivated to exercise is to wear workout clothes all day. Fake it till you make it, right?",
  },
  {
    text: `I just realized that I've been mispronouncing "quinoa" my entire life. It's a good thing I don't order it at restaurants.`,
  },
  {
    text: "I wish I could have a conversation with my dog and find out what he's really thinking. Probably just food and naps, but still.",
  },
  {
    text: "Is it just me, or does anyone else get excited when they find a song that perfectly describes their current mood? It's like a musical therapy session.",
  },
  {
    text: "I think I need a vacation from adulting. Can I just go back to being a kid and having nap time and recess every day?",
  },
  {
    text: "Sometimes I wonder if my cat Mittens is actually a professional napper. She takes her craft very seriously.",
  },
  {
    text: "If you want to see pure joy, just wave a laser pointer in front of my cat Mittens. She'll turn into a tiny ball of excitement.",
  },
  {
    text: "I don't think my cat Mittens knows how to walk. She just bounces around the house like a little orange kangaroo.",
    photo: "https://source.unsplash.com/random/600×600/?orange%20cat",
  },
  {
    text: "I'm convinced that my cat Mittens is plotting world domination, but she's too cute for anyone to suspect her.",
    photo: "https://source.unsplash.com/random/600×600/?orange%20cat",
  },
  {
    text: "I don't think I've ever met a dog who loves belly rubs as much as Oreo. It's like his favorite hobby.",
    photo: "https://source.unsplash.com/random/600×600/?small%20dog",
  },
  {
    text: "I'm convinced that Oreo is part rabbit. He can jump to impossible heights when he's playing outside.",
  },
  {
    text: "If you're feeling down, just snuggle up with Oreo. His warm furry body and contagious joy will make everything better.",
  },
  {
    text: "If you want to see pure happiness, just let Oreo run around outside. He's like a little tornado of joy.",
    photo: "https://source.unsplash.com/random/600×600/?small%20dog",
  },
  {
    text: "Oreo loves to explore the world and discover new smells. He's like a little detective on a mission.",
    photo: "https://source.unsplash.com/random/600×600/?small%20dog",
  },
  {
    text: "Every time I watch The Princess Bride, I fall in love with the story all over again. It's a timeless classic.",
  },
  {
    text: "I think I could recite every line of The Princess Bride by heart. It's that good.",
  },
  {
    text: "I don't think there's a better on-screen duo than Westley and Buttercup. Their love is pure magic.",
  },
  {
    text: "I always forget how much I love Inigo Montoya until I watch The Princess Bride again. He's a true hero.",
  },
  {
    text: "If you've never seen The Princess Bride, stop what you're doing and watch it immediately. You won't regret it.",
  },
  {
    text: "Brunch is like a hug in meal form. It's warm, comforting, and makes you feel all warm and fuzzy inside.",
    photo: "https://source.unsplash.com/random/600×600/?brunch",
  },
  {
    text: "Is there anything better than catching up with friends over mimosas and eggs benedict at brunch? I think not.",
  },
  {
    text: "Brunch is like a mini-vacation in the middle of the day. It's a chance to slow down and savor the moment.",
  },
  {
    text: "Brunch is a celebration of lazy mornings and slow afternoons. It's a chance to relax and enjoy the simple things in life.",
    photo: "https://source.unsplash.com/random/600×600/?brunch",
  },
  {
    text: "Brunch is the perfect way to cure a hangover. A little hair of the dog and a lot of carbs can work wonders.",
  },
  {
    text: "I can't wait to get my new tattoo! It's been a while since my last one, and I'm itching for some new ink.",
  },
  {
    text: "The anticipation of getting a new tattoo is almost as exciting as the tattoo itself. The possibilities are endless!",
  },
  {
    text: "There's something so therapeutic about getting a new tattoo. It's a chance to release emotions and express yourself in a unique way.",
  },
  {
    text: "I love the feeling of being in the tattoo studio. It's a place of creativity, expression, and freedom.",
  },
  {
    text: "Getting a new tattoo is a commitment, but it's also a beautiful way to honor something or someone that's important to you. I can't wait to wear mine with pride.",
  },
];

const ONE_HOUR = 3600;
const ONE_DAY = ONE_HOUR * 24;

const getTimestamp = (date: Date) => {
  return Math.floor(date.getTime() / 1000);
};

export const getAge = (date: Date) => {
  const today = getTimestamp(new Date());
  const diff = today - getTimestamp(date);
  if (diff < ONE_HOUR) {
    return {
      unit: "m",
      value: Math.floor(diff / 60),
    };
  } else if (diff < ONE_DAY) {
    return {
      unit: "h",
      value: Math.floor(diff / ONE_HOUR),
    };
  } else {
    return {
      unit: "d",
      value: Math.floor(diff / ONE_DAY),
    };
  }
};
