/** Static landing page HTML injected at build time for crawler-visible content */
export const LANDING_STATIC_HTML = `
<main id="seo-landing-fallback" aria-hidden="true" style="position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0">
  <h1>PortlifyAi — AI-Powered Resume to Portfolio Builder</h1>
  <p>Turn your resume into a professional portfolio in under 30 seconds. Free to use — upload PDF, DOC, or DOCX and get a shareable URL at portlifyai.app.</p>

  <h2>How It Works</h2>
  <ol>
    <li><strong>Upload your resume</strong> — PDF, DOC, or DOCX supported</li>
    <li><strong>AI extracts your data</strong> — 95% parse accuracy across supported formats</li>
    <li><strong>Portfolio goes live</strong> — custom URL ready in under 30 seconds</li>
    <li><strong>Share anywhere</strong> — LinkedIn, GitHub, resume, or social media</li>
  </ol>

  <h2>Key Features</h2>
  <ul>
    <li>AI Resume Parsing with 95% accuracy</li>
    <li>Instant portfolio generation with custom username URLs</li>
    <li>Portfolio analytics and visitor tracking</li>
    <li>Multiple themes: Modern, Minimal, Creative, Professional</li>
    <li>Dark and light mode support</li>
    <li>Mobile-responsive design</li>
    <li>Completely free — no credit card required</li>
  </ul>

  <h2>PortlifyAi vs Manual Portfolio Building</h2>
  <table border="1" cellpadding="8" cellspacing="0" style="border-collapse:collapse;width:100%">
    <thead>
      <tr><th>Feature</th><th>PortlifyAi</th><th>Manual Build</th></tr>
    </thead>
    <tbody>
      <tr><td>Time to launch</td><td>Under 30 seconds</td><td>Hours to days</td></tr>
      <tr><td>Cost</td><td>Free</td><td>Hosting + domain fees</td></tr>
      <tr><td>Resume parsing</td><td>AI-powered (95% accuracy)</td><td>Manual copy-paste</td></tr>
      <tr><td>SEO-ready pages</td><td>Built-in</td><td>Requires setup</td></tr>
      <tr><td>Analytics</td><td>Included</td><td>Third-party tools</td></tr>
    </tbody>
  </table>

  <h2>Frequently Asked Questions</h2>
  <dl>
    <dt>What is PortlifyAi?</dt>
    <dd>PortlifyAi is a free AI-powered tool that transforms your resume into a professional portfolio website in seconds. Upload PDF, DOC, or DOCX and AI extracts your skills and experience into a shareable portfolio URL.</dd>
    <dt>Is PortlifyAi really free?</dt>
    <dd>Yes, PortlifyAi is completely free to use. You can create and publish your portfolio with no credit card required. Premium features like custom branding and priority support are available as optional upgrades.</dd>
    <dt>How does the AI resume parser work?</dt>
    <dd>PortlifyAi uses machine learning models to analyze your uploaded resume, extracting key information including skills, work experience, education, projects, and contact details with 95% accuracy.</dd>
    <dt>What file formats are supported?</dt>
    <dd>PortlifyAi supports PDF, DOC, and DOCX file formats for resume uploads.</dd>
    <dt>Can I customize my portfolio design?</dt>
    <dd>Yes, PortlifyAi offers multiple themes including Modern, Minimal, Creative, and Professional, with dark and light modes.</dd>
    <dt>How do I share my portfolio?</dt>
    <dd>Once generated, you get a custom URL to share on LinkedIn, GitHub, your resume, or social media.</dd>
  </dl>

  <p><a href="https://portlifyai.app/sign-up">Get Started Free</a> | <a href="https://portlifyai.app/premium">Premium Plans</a></p>
</main>
`.trim()
