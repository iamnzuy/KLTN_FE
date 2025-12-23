// Relative paths assume files are placed directly under `public` as `prod1.jpg`, ...
export const CHATBOT_SAMPLE_IMAGES = Array.from({ length: 20 }, (_, index) => {
  const order = index + 1;
  return `/prod${order}.jpg`;
});

