/**
 * Mock Component Generator for Development
 * Generates realistic components without calling the AI API
 * Use this when OpenRouter is rate-limited
 */

const mockComponents = [
  {
    name: "ModernCard",
    description: "A modern card component with gradient background",
    code: `export default function ModernCard({ title, description, onClick }) {
  return (
    <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-lg p-6 cursor-pointer hover:shadow-2xl transition-shadow" onClick={onClick}>
      <h3 className="text-white font-bold text-xl mb-2">{title}</h3>
      <p className="text-gray-100">{description}</p>
    </div>
  );
}`,
    props: ["title", "description", "onClick"],
    category: "Cards"
  },
  {
    name: "GlassButton",
    description: "A glassmorphism button with blur effect",
    code: `export default function GlassButton({ text, onClick, variant = "primary" }) {
  const baseClass = "px-6 py-3 rounded-lg font-semibold backdrop-blur-md transition-all duration-300";
  const variants = {
    primary: "bg-white/20 text-white border border-white/30 hover:bg-white/30",
    secondary: "bg-black/20 text-black border border-black/30 hover:bg-black/30"
  };
  
  return (
    <button className={\`\${baseClass} \${variants[variant]}\`} onClick={onClick}>
      {text}
    </button>
  );
}`,
    props: ["text", "onClick", "variant"],
    category: "Buttons"
  },
  {
    name: "AnimatedLoader",
    description: "Smooth animated loading spinner",
    code: `export default function AnimatedLoader({ size = "md" }) {
  const sizes = { sm: "w-6 h-6", md: "w-10 h-10", lg: "w-16 h-16" };
  
  return (
    <div className={\`\${sizes[size]} border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin\`}></div>
  );
}`,
    props: ["size"],
    category: "Loaders"
  },
  {
    name: "PricingCard",
    description: "A pricing tier card with features list",
    code: `export default function PricingCard({ plan, price, features, highlighted = false }) {
  return (
    <div className={\`\${highlighted ? 'border-2 border-blue-500 bg-blue-50' : 'border border-gray-200'} rounded-lg p-6 text-center\`}>
      <h3 className="text-2xl font-bold mb-2">{plan}</h3>
      <p className="text-4xl font-bold text-blue-600 mb-4">\${price}/mo</p>
      <ul className="text-left space-y-2 mb-6">
        {features.map((feature, i) => <li key={i} className="text-gray-700">✓ {feature}</li>)}
      </ul>
      <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">Choose Plan</button>
    </div>
  );
}`,
    props: ["plan", "price", "features", "highlighted"],
    category: "Commerce"
  },
  {
    name: "InputField",
    description: "Styled input with validation feedback",
    code: `export default function InputField({ label, type = "text", error, value, onChange, placeholder }) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={\`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 \${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}\`}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}`,
    props: ["label", "type", "error", "value", "onChange", "placeholder"],
    category: "Forms"
  }
];

export const generateMockComponent = (prompt) => {
  console.log("📦 Generating mock component for prompt:", prompt);
  
  // Pick a random component
  const randomComponent = mockComponents[Math.floor(Math.random() * mockComponents.length)];
  
  return {
    success: true,
    component: {
      ...randomComponent,
      generatedAt: new Date().toISOString(),
      mockGenerated: true,
      note: "This is a mock component. Set OPENROUTER_API_KEY to generate custom components."
    }
  };
};

export const isDevelopmentMode = () => {
  // Use mock if no API key or if explicitly enabled
  return !process.env.OPENROUTER_API_KEY || process.env.USE_MOCK_COMPONENTS === "true";
};
