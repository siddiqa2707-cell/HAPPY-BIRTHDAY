// =================================================================
// 🎂 HAPPY BIRTHDAY WEBSITE CONFIGURATION
// Customize all birthday details, messages, and photos here!
// =================================================================

const CONFIG = {
  // Birthday Star's Information
  name: "Ansh",           // Name of the birthday person (e.g. "Alex", "Sarah", "My Love")
  titleTag: "Happy Birthday! 🎉", // Website browser tab title
  age: "Special Day",        // e.g. "21st", "Superstar", "Forever Young"

  // 🎮 Stage 1: The "Impossible No" Game Settings
  game: {
    question: "Do you accept 1,000,000 birthday hugs, endless cake, and all my best wishes today? 💖",
    yesButtonText: "YES! Of Course! 🥰",
    noButtonText: "No 😜",
    noButtonMessages: [
      "Are you sure? 😮",
      "Think again! 🤔",
      "Nice try! 😜",
      "You can't click me! 🚀",
      "Press YES already! 💕",
      "Still trying? 😂",
      "No option not allowed! 🚫",
      "Just click YES! 🥳"
    ]
  },

  // 💌 Birthday Wishes & Cards (Displayed in the Wishes Slider)
  wishes: [
    {
      icon: "✨",
      title: "Wishing You The Best!",
      text: "May your day be filled with endless laughter, boundless joy, and unforgettable moments. You deserve all the happiness in the world!"
    },
    {
      icon: "🌟",
      title: "Shine Bright!",
      text: "Another year older, wiser, and even more amazing. Keep shining bright and inspiring everyone around you with your wonderful energy!"
    },
    {
      icon: "🎁",
      title: "Endless Celebrations",
      text: "Here's to new adventures, big dreams, and all the sweet surprises this year has in store for you. Happy Birthday!"
    },
    {
      icon: "💖",
      title: "Forever Cherished",
      text: "Thank you for being such an incredible presence in my life. Celebrating you today and every day!"
    }
  ],

  // 🎁 Interactive Surprise Gift Boxes
  gifts: [
    {
      id: 1,
      title: "Surprise #1 🎟️",
      boxLabel: "Open Me First!",
      content: "A VIP Coupon for unlimited birthday hugs, your favorite dessert, and zero worries all day! 🍰 HUG APPROVED!"
    },
    {
      id: 2,
      title: "Surprise #2 👑",
      boxLabel: "A Secret Wish",
      content: "May all your secret wishes, grandest dreams, and wildest goals come true this year! You are capable of amazing things."
    },
    {
      id: 3,
      title: "Surprise #3 💌",
      boxLabel: "Special Note",
      content: "You make the world a warmer, brighter, and happier place just by being in it. Stay wonderful always! ✨"
    }
  ],

  // 📸 Polaroid Memories Gallery (Replace image URLs with your own photos!)
  photos: [
    {
      url: "https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=600&q=80",
      caption: "Party Time! 🎉"
    },
    {
      url: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=600&q=80",
      caption: "Balloons & Joy 🎈"
    },
    {
      url: "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&w=600&q=80",
      caption: "Sweetest Cake 🎂"
    },
    {
      url: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80",
      caption: "Unforgettable Moments ✨"
    }
  ],

  // 🎂 Cake Wish Unlocked Message (Shown when candles are blown out)
  secretCakeWish: "🎉 Woohoo! Candles blown out! May your year ahead be as sweet as this cake and filled with golden moments! ✨"
};
