import { Workflow } from "lucide-react";

export const Footer = () => (
  <footer className="border-t border-border bg-background pt-16 pb-8 px-6">
    <div className="container mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
      <div className="col-span-2">
        <div className="flex items-center gap-2 font-bold text-xl tracking-tight text-foreground mb-4">
          <div className="w-6 h-6 rounded bg-primary flex items-center justify-center text-primary-foreground">
            <Workflow size={14} />
          </div>
          FormFlow
        </div>
        <p className="text-muted-foreground max-w-sm">
          The most powerful form builder for creators and businesses. Publish
          dynamic forms in seconds.
        </p>
      </div>
      <div>
        <h4 className="font-semibold mb-4">Product</h4>
        <ul className="space-y-2 text-muted-foreground text-sm">
          <li>
            <a href="#" className="hover:text-primary transition-colors">
              Features
            </a>
          </li>
          <li>
            <a href="#" className="hover:text-primary transition-colors">
              Templates
            </a>
          </li>
          <li>
            <a href="#" className="hover:text-primary transition-colors">
              Integrations
            </a>
          </li>
          <li>
            <a href="#" className="hover:text-primary transition-colors">
              Pricing
            </a>
          </li>
        </ul>
      </div>
      <div>
        <h4 className="font-semibold mb-4">Legal</h4>
        <ul className="space-y-2 text-muted-foreground text-sm">
          <li>
            <a href="#" className="hover:text-primary transition-colors">
              Privacy Policy
            </a>
          </li>
          <li>
            <a href="#" className="hover:text-primary transition-colors">
              Terms of Service
            </a>
          </li>
          <li>
            <a href="#" className="hover:text-primary transition-colors">
              Security
            </a>
          </li>
        </ul>
      </div>
    </div>
    <div className="container mx-auto border-t border-border pt-8 text-center text-sm text-muted-foreground">
      © {new Date().getFullYear()} FormFlow Inc. All rights reserved.
    </div>
  </footer>
);