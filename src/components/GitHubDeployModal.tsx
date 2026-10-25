import React, { useState } from 'react';
import { 
  X, 
  Github, 
  Check, 
  Copy, 
  ExternalLink, 
  Terminal, 
  Sparkles, 
  Globe, 
  ShieldCheck, 
  Layers,
  HelpCircle
} from 'lucide-react';

interface GitHubDeployModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GitHubDeployModal: React.FC<GitHubDeployModalProps> = ({
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  const [username, setUsername] = useState('');
  const [repoName, setRepoName] = useState('ns-computers-store');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const cleanUser = username.trim() || 'YOUR_GITHUB_USERNAME';
  const cleanRepo = repoName.trim() || 'ns-computers-store';
  const liveUrl = `https://${cleanUser}.github.io/${cleanRepo}/`;

  const copyToClipboard = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 1500);
  };

  const gitCommands = [
    `git init`,
    `git add .`,
    `git commit -m "Deploy NS Computers Store & Admin with Persistent Storage"`,
    `git branch -M main`,
    `git remote add origin https://github.com/${cleanUser}/${cleanRepo}.git`,
    `git push -u origin main`
  ].join('\n');

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        className="relative bg-white rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden border border-slate-100 my-6 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 bg-slate-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-800 text-sky-400 flex items-center justify-center border border-slate-700">
              <Github className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">Host on GitHub Pages (Public & Free)</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Ready to Deploy
                </span>
              </div>
              <p className="text-xs text-slate-400">Step-by-step instructions to make your store live for everyone.</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto text-xs text-slate-600">
          
          {/* Key Advantages box */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 bg-blue-50/70 rounded-xl border border-blue-100">
              <Globe className="w-4 h-4 text-blue-600 mb-1" />
              <h4 className="font-bold text-blue-900 text-xs">Public Access</h4>
              <p className="text-[11px] text-blue-700 mt-0.5">Accessible worldwide via fast global GitHub CDN.</p>
            </div>
            <div className="p-3 bg-emerald-50/70 rounded-xl border border-emerald-100">
              <ShieldCheck className="w-4 h-4 text-emerald-600 mb-1" />
              <h4 className="font-bold text-emerald-900 text-xs">Relative Base URL</h4>
              <p className="text-[11px] text-emerald-700 mt-0.5">Configured with <code className="bg-emerald-100 px-1 rounded">base: './'</code> so assets never 404.</p>
            </div>
            <div className="p-3 bg-purple-50/70 rounded-xl border border-purple-100">
              <Sparkles className="w-4 h-4 text-purple-600 mb-1" />
              <h4 className="font-bold text-purple-900 text-xs">Automated Actions</h4>
              <p className="text-[11px] text-purple-700 mt-0.5">Pre-configured <code className="bg-purple-100 px-1 rounded">.github/workflows/deploy.yml</code> deploys on push.</p>
            </div>
          </div>

          {/* Calculator: Your Live URL */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
            <label className="block font-bold text-slate-800 text-xs uppercase tracking-wider">
              Configure Your GitHub Details:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <span className="block text-[11px] text-slate-500 mb-1 font-semibold">GitHub Username:</span>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. nipundev"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-mono text-xs focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <span className="block text-[11px] text-slate-500 mb-1 font-semibold">Repository Name:</span>
                <input
                  type="text"
                  value={repoName}
                  onChange={(e) => setRepoName(e.target.value)}
                  placeholder="e.g. ns-computers-store"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-mono text-xs focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-[11px] text-slate-500 block">Your Public Live Website URL will be:</span>
                <span className="font-mono font-bold text-blue-600 break-all">{liveUrl}</span>
              </div>
              {username && (
                <a
                  href={liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shrink-0 transition"
                >
                  <span>Open URL</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>

          {/* 3 Simple Steps */}
          <div className="space-y-4">
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
              <Terminal className="w-4 h-4 text-blue-600" />
              <span>3-Step Quick Deployment:</span>
            </h4>

            {/* Step 1 */}
            <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-[10px]">
                  1
                </span>
                <span className="font-bold text-slate-800">Create a repository on GitHub</span>
              </div>
              <p className="text-slate-500 pl-7 text-[11px]">
                Go to <a href="https://github.com/new" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-semibold inline-flex items-center gap-0.5">github.com/new <ExternalLink className="w-3 h-3" /></a>, name it <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-slate-800">{cleanRepo}</code>, and make it <strong>Public</strong>. Do not check "Add a README" (keep it empty).
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-[10px]">
                    2
                  </span>
                  <span className="font-bold text-slate-800">Push the code to GitHub</span>
                </div>
                <button
                  onClick={() => copyToClipboard(gitCommands, 1)}
                  className="flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md"
                >
                  {copiedIndex === 1 ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedIndex === 1 ? 'Copied Commands!' : 'Copy Commands'}</span>
                </button>
              </div>
              <pre className="bg-slate-900 text-slate-200 p-3 rounded-lg font-mono text-[11px] overflow-x-auto leading-relaxed border border-slate-800">
                {gitCommands}
              </pre>
            </div>

            {/* Step 3 */}
            <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-[10px]">
                  3
                </span>
                <span className="font-bold text-slate-800">Enable GitHub Pages in Repository Settings</span>
              </div>
              <div className="pl-7 text-[11px] text-slate-600 space-y-1">
                <p>1. In your GitHub repository, click on <strong>Settings</strong>.</p>
                <p>2. In the left sidebar, click <strong>Pages</strong>.</p>
                <p>3. Under <strong>Build and deployment &rarr; Source</strong>, select <strong>GitHub Actions</strong>.</p>
                <p className="text-emerald-700 font-semibold mt-1">
                  &check; That's all! The pre-configured GitHub Actions workflow will automatically build the site and publish it live!
                </p>
              </div>
            </div>
          </div>

          {/* Permanent Data Save Info */}
          <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 space-y-2">
            <h5 className="font-bold text-amber-900 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-amber-700" />
              <span>How "Permanent Data Save" works on GitHub Pages</span>
            </h5>
            <p className="text-[11px] text-amber-800 leading-relaxed">
              GitHub Pages hosts static frontends. For true multi-device permanent storage (e.g. when customers place orders on their phones, you instantly see the orders in your Admin Portal):
            </p>
            <ul className="text-[11px] text-amber-800 list-disc list-inside space-y-1">
              <li><strong>Free Firebase Firestore Cloud Database:</strong> Go to the Admin Portal &rarr; <em>Cloud Persistence</em> tab. Simply connect a free Firebase project and all orders and products sync across all devices worldwide in real-time!</li>
              <li><strong>Automatic Local Offline Storage:</strong> If cloud is not configured, all products, orders, and edits are permanently saved in your browser's persistent storage.</li>
              <li><strong>1-Click Backup & Restore:</strong> You can export complete JSON backups or CSV files at any time with a single click.</li>
            </ul>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <span className="text-xs text-slate-400">NS Computers And Electronics</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition"
          >
            Got It! Close
          </button>
        </div>
      </div>
    </div>
  );
};
