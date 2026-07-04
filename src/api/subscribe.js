export const submitSubscription = async ({ userName, email, githubUsername, companyName, categories }) => {
  const webhookUrl = import.meta.env.VITE_GOOGLE_SHEETS_WEBHOOK_URL;

  if (!webhookUrl) {
    throw new Error('VITE_GOOGLE_SHEETS_WEBHOOK_URL is not set. See docs/subscribe-google-sheets-setup.md.');
  }

  await fetch(webhookUrl, {
    method: 'POST',
    mode: 'no-cors',
    headers: {
      'Content-Type': 'text/plain;charset=utf-8',
    },
    body: JSON.stringify({ userName, email, githubUsername, companyName, categories }),
  });
};
