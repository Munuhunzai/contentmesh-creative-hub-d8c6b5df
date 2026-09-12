export type ServicePage = {
  slug: string;
  title: string;
  searchTitle?: string;
  description: string;
  summary: string;
  audience: string;
  deliverables: string[];
  sections: Array<{ title: string; text: string }>;
  brief: string[];
  questions: Array<{ question: string; answer: string }>;
};

// Editorial service descriptions. Scope, price and schedule are agreed per brief.
// No invented client results, fixed prices or turnaround guarantees.
export const servicePages: ServicePage[] = [
  {
    slug: "ai-commercial-video-production",
    title: "AI Commercial Video Production",
    description:
      "Human-directed AI commercials for brands: concept, storyboard, generated scenes, editing and campaign cutdowns. Explore the process and request a scoped quote.",
    summary:
      "ContentMesh Studios creates AI-assisted commercials by combining creative direction, generated visuals and human editing. The work starts with your audience and message, then moves through a storyboard, visual development and a finished campaign edit.",
    audience:
      "For brands and agencies planning a launch, a brand film or a paid-social campaign that needs a distinctive visual concept.",
    deliverables: [
      "Creative concept and script agreed before production",
      "Storyboard and visual references for approval",
      "AI-generated scenes combined with supplied assets where appropriate",
      "Editing, color treatment, sound and approved voiceover",
      "Master edit and agreed platform-specific cutdowns",
    ],
    sections: [
      {
        title: "A commercial needs a clear message before it needs a model",
        text: "A striking shot is useful only when it supports the campaign. We start by defining the audience, the single message viewers should remember and the action they should take. A launch film may need atmosphere and product recognition; a direct-response ad may need a clear offer and several opening hooks. Those choices shape the script, shot count and edit.",
      },
      {
        title: "Approve the visual direction before generating every scene",
        text: "A storyboard connects the message to the images. Reference frames establish subjects, environments, lighting and camera direction before full production. This is the point to resolve major changes to the story or product treatment. Agreeing the direction early helps avoid regenerating a sequence after the final edit has begun.",
      },
      {
        title: "Choose AI, supplied footage or a hybrid approach",
        text: "Generative visuals are useful for imagined environments and stylized sequences. Supplied footage, product photography or compositing can be more suitable when an exact logo, label, demonstration or physical detail must remain unchanged. We assess those requirements in the brief rather than assuming every shot should be generated.",
      },
      {
        title: "Plan versions as part of the campaign",
        text: "A vertical ad is more than a cropped widescreen film. Subject placement, captions and the call to action need to work in the intended frame. Tell us which placements you need so the storyboard can allow for them. Hook variations, shorter edits, language versions and additional formats should be listed in the scope.",
      },
    ],
    brief: [
      "Your product or service, audience and campaign objective",
      "Brand guidelines, approved claims and visual references",
      "Target duration and distribution channels",
      "Required versions, languages and captions",
      "Budget range, deadline and approval contact",
    ],
    questions: [
      {
        question: "How much does an AI commercial cost?",
        answer:
          "ContentMesh quotes after reviewing the brief. Duration, unique scenes, product accuracy, characters, voiceover, revisions and version count all affect scope. An AI tool subscription is not the same purchase as a finished commercial with direction and post-production. Ask for a quote that names the deliverables and revision stages.",
      },
      {
        question: "How long does production take?",
        answer:
          "A schedule is agreed after the script, visual complexity and approval process are understood. Multiple characters, exact product details and additional language versions can require more work. Include your launch date and feedback availability in the brief so the proposed schedule accounts for both production and approvals.",
      },
      {
        question: "Can you adapt a commercial for Meta, TikTok and YouTube?",
        answer:
          "Yes. Specify the placements and required aspect ratios in the brief. We can scope vertical, square and widescreen edits, with opening hooks, captions and end cards suited to each version. Ad results also depend on your offer, targeting and media buying; creative production alone cannot guarantee sales.",
      },
      {
        question: "What should we agree about usage rights?",
        answer:
          "List the intended channels, regions and assets in the production agreement. Confirm permissions for supplied footage, logos, voices and likenesses, and the applicable terms for generated material and music. The agreed scope should make clear what can be used and which source files, if any, are included.",
      },
    ],
  },
  {
    slug: "ai-product-video-ads",
    title: "AI Product Video Ads",
    description:
      "AI-assisted product video ads for ecommerce and brand launches. Plan product accuracy, hooks, visual concepts and social cutdowns with ContentMesh Studios.",
    summary:
      "ContentMesh Studios produces AI-assisted product video ads using your product references, a clear creative concept and human post-production. The goal is to communicate what the product is, why it matters and what the viewer should do next.",
    audience:
      "For ecommerce brands and product marketers who need launch visuals, social ad concepts or a consistent set of campaign variations.",
    deliverables: [
      "Product-focused concept and shot plan",
      "Visual direction based on approved product references",
      "Generated or composited scenes selected for product accuracy",
      "Edited ad with approved copy, branding and audio",
      "Agreed hook, duration and aspect-ratio variations",
    ],
    sections: [
      {
        title: "Product accuracy comes first",
        text: "Packaging, logos, materials and proportions need deliberate review. Provide clear photographs from the angles required in the ad, together with label artwork and approved colors. For jewelry, that may mean the stone setting and metal finish; for packaged goods, the label and container shape. These details should be checked against your references before the edit is approved.",
      },
      {
        title: "Show the benefit without inventing a demonstration",
        text: "A concept can use atmosphere, scale and an imagined environment to make a product memorable. It should still distinguish visual storytelling from a factual demonstration. If a shot must show how a real mechanism works or substantiate a product claim, provide verified footage or specifications. We can plan the scene around those assets instead of asking a model to invent the evidence.",
      },
      {
        title: "Build useful variations for creative testing",
        text: "Different opening images, headlines and calls to action give your media team distinct ideas to test. Keep the product, offer and measurement window clear so you can understand what changed between versions. The brief should name the number of hooks and edits; an unlimited set of versions is not assumed. Share campaign findings if you want a later round of creative to respond to them.",
      },
      {
        title: "A product film and a product demo solve different problems",
        text: "A launch film can establish mood and recognition. A demonstration needs to explain a feature accurately. A short social ad needs to make its message clear in a limited time. Deciding which job the video must perform helps choose the right mix of photography, generated scenes, typography, narration and supplied footage.",
      },
    ],
    brief: [
      "Product photographs, packaging artwork and brand assets",
      "Approved product benefits and claims",
      "Audience, offer and destination page",
      "Visual references and details that must stay exact",
      "Ad placements, version count, budget and deadline",
    ],
    questions: [
      {
        question: "Can an AI-generated video preserve my product exactly?",
        answer:
          "Exact preservation should not be assumed. Generated scenes can alter labels, geometry or small details. The workflow may use your original product photography, compositing or supplied footage for critical shots. Product references and an approval checkpoint are essential to deciding which approach fits.",
      },
      {
        question: "Do we need to send a physical product?",
        answer:
          "A project may be possible from suitable photographs and brand files, but it depends on the shots and the level of accuracy required. Send the references first. If a real demonstration or additional photography is needed, that should be identified before confirming the production scope.",
      },
      {
        question: "Can you make jewelry or beauty product ads?",
        answer:
          "These briefs can be assessed using product photographs and visual references. For jewelry, include close views of stones, settings and finishes. For beauty products, include packaging artwork and approved claims. The plan should identify details that require original assets rather than generated substitutions.",
      },
      {
        question: "What affects the price of a product ad?",
        answer:
          "The main scope factors are the number of products and scenes, accuracy requirements, animation complexity, revisions, audio and the number of final edits. Share those details for a quote. Published prices from another studio do not establish what your specific project will cost.",
      },
    ],
  },
  {
    slug: "ai-youtube-video-production",
    title: "AI YouTube Video Production",
    searchTitle: "Faceless YouTube Video Production & Editing | ContentMesh",
    description:
      "Faceless YouTube video production with AI visuals, narration, storyboards and human editing. Plan a documentary, explainer or ongoing series with ContentMesh.",
    summary:
      "ContentMesh Studios helps creators turn a script or episode idea into a finished AI-assisted YouTube video. Storyboarding, visual continuity, narration and editing are planned together so the episode works as a story, not just a sequence of generated clips.",
    audience:
      "For creators and teams developing faceless documentaries, narrated explainers or cinematic story series.",
    deliverables: [
      "Episode outline or production plan for your supplied script",
      "Narration-matched storyboard and shot list",
      "Character and environment references where required",
      "Generated visuals assembled with narration and sound",
      "Final episode and agreed thumbnail or short-form cutdowns",
    ],
    sections: [
      {
        title: "Faceless YouTube videos built around your narration",
        text: "The script determines what the audience needs to understand and when. A storyboard maps each narration passage to a purposeful image, action or transition. If you already have a voiceover, share it before shot planning so scenes fit the actual pacing. If you need script development, include that in the brief rather than treating it as an automatic part of editing.",
      },
      {
        title: "Keep characters and locations consistent",
        text: "A recurring character or environment needs a reference plan. Establish appearance, wardrobe, location layout and visual style before generating alternate angles. Close-ups should preserve the scene's context. Review important reference frames early; continuity problems become more expensive to resolve once many shots depend on them.",
      },
      {
        title: "Use editing to support understanding",
        text: "An episode needs more than a visual for every sentence. Shot duration, sound, pauses and transitions help viewers follow the narrative. The edit should remove repetition and make changes in location, time or subject clear. For factual material, the production brief should distinguish documentary evidence, illustrative reconstruction and speculation.",
      },
      {
        title: "Make a pilot before scaling a series",
        text: "A pilot establishes the visual language, approval stages and level of production the channel can sustain. It also reveals how much work a particular script style requires. For an ongoing series, agree how scripts, voices, references and feedback will be handed over. Episode length alone does not describe the workload: scene count, dialogue and continuity matter too.",
      },
    ],
    brief: [
      "Channel link, audience and example episodes",
      "Script, narration and source notes if already available",
      "Target duration and visual style",
      "Recurring character and environment requirements",
      "Publishing plans, review stages, budget and deadline",
    ],
    questions: [
      {
        question: "Can you work from my script and voiceover?",
        answer:
          "Yes. Share the final script and audio, plus reference videos and any continuity instructions. A narration-matched storyboard can then define the scenes before generation. Changes to approved narration may also change shot timing and editing scope.",
      },
      {
        question: "Can you produce talking characters?",
        answer:
          "Dialogue scenes can be scoped separately from narrated sequences. They need clear speaker timing, suitable character references and lip-sync review. Share the voices, dialogue and framing requirements early so the production plan accounts for them.",
      },
      {
        question: "Does AI production guarantee YouTube monetization or growth?",
        answer:
          "No. A production service cannot guarantee monetization, views or subscriber growth. Your channel still needs original value, appropriate rights and compliance with the platform's current requirements. Review the finished episode and any disclosure requirements before publishing.",
      },
      {
        question: "How do we estimate an ongoing series?",
        answer:
          "Start with one representative script or pilot. Define the episode length, scene complexity, recurring assets, audio requirements and number of revisions. Use that scope to agree a realistic production schedule and budget rather than assuming every minute of video takes the same amount of work.",
      },
    ],
  },
];

export function getServicePage(slug: string) {
  return servicePages.find((page) => page.slug === slug);
}
