export const getTitlePrompt = (
  userPrompt: string,
  fullResponse: string
) => `
    Based on the conversation context, please generate a concise and descriptive title for the conversation. The title should reflect the main topic or theme discussed in the conversation.

    - user: ${userPrompt.slice(0, 200)}
    - assistant: ${fullResponse.slice(0, 200)}

    Respond with ONLy the title, no quotes, no explanation, and no markup. Example of good titles:
    - "Resume Writing Tips"
    - "Career Growth Strategies"
    - "Interview Preparation Tips"
    - "How To Learn Dark Psychology"
    - "Career Advancement Strategies"
    - "Effective Job Search Techniques"
    - "Updating Resume For Career Growth"
    - "Networking Strategies For Career Success"
    - "Interview Techniques For Career Advancement"
    - "Best Practices For Learning Dark Psychology"
    `;
