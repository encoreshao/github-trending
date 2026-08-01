import React, { useState } from 'react';
import { Button, Input, message } from 'antd';
import { CheckOutlined, CheckCircleFilled, GithubOutlined, RocketOutlined, UserOutlined, BankOutlined, MailOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import RanbotPromoSection from '../components/RanbotPromoSection';
import DailyOverviewSection from '../components/DailyOverviewSection';
import SectionDivider from '../components/SectionDivider';
import { submitSubscription } from '../api/subscribe';
import './SubscriptionPage.css';

const SubscriptionPage = () => {
  const navigate = useNavigate();
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [githubUsername, setGithubUsername] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [touched, setTouched] = useState({ userName: false, email: false });

  const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isEmailValid = EMAIL_PATTERN.test(email);
  const nameError = touched.userName && !userName.trim() ? 'Name is required' : '';
  const emailError = touched.email
    ? (!email.trim() ? 'Email is required' : !isEmailValid ? 'Enter a valid email address' : '')
    : '';
  const markTouched = (field) => setTouched((t) => ({ ...t, [field]: true }));

  const categories = [
    { id: 'javascript', name: 'JavaScript', description: 'Web development and frameworks', icon: '⚡' },
    { id: 'python', name: 'Python', description: 'Data science and automation', icon: '🐍' },
    { id: 'react', name: 'React', description: 'Frontend frameworks and libraries', icon: '⚛️' },
    { id: 'vue', name: 'Vue.js', description: 'Progressive JavaScript framework', icon: '💚' },
    { id: 'nodejs', name: 'Node.js', description: 'Server-side JavaScript', icon: '🟢' },
    { id: 'typescript', name: 'TypeScript', description: 'Typed JavaScript superset', icon: '🔷' },
    { id: 'ai', name: 'AI & Machine Learning', description: 'Artificial intelligence and ML', icon: '🤖' },
    { id: 'ai-agents', name: 'AI Agents', description: 'Autonomous AI agents and assistants', icon: '🤖' },
    { id: 'llm', name: 'Large Language Models', description: 'LLMs, GPT, and language AI', icon: '🧠' },
    { id: 'computer-vision', name: 'Computer Vision', description: 'Image and video processing', icon: '👁️' },
    { id: 'nlp', name: 'Natural Language Processing', description: 'Text analysis and language AI', icon: '💬' },
    { id: 'deep-learning', name: 'Deep Learning', description: 'Neural networks and deep learning', icon: '🧠' },
    { id: 'generative-ai', name: 'Generative AI', description: 'Text, image, and video generation', icon: '🎨' },
    { id: 'blockchain', name: 'Blockchain', description: 'Cryptocurrency and Web3', icon: '⛓️' },
    { id: 'mobile', name: 'Mobile Development', description: 'iOS and Android apps', icon: '📱' },
    { id: 'devops', name: 'DevOps', description: 'Infrastructure and deployment', icon: '🔧' },
    { id: 'security', name: 'Security', description: 'Cybersecurity and privacy', icon: '🔒' },
    { id: 'design', name: 'Design', description: 'UI/UX and graphics', icon: '🎨' },
    { id: 'gitlab', name: 'GitLab', description: 'GitLab tooling, CI/CD, and self-hosted Git', icon: '🦊' }
  ];

  const handleSubscribe = async () => {
    setSubmitting(true);
    try {
      await submitSubscription({
        userName,
        email,
        githubUsername,
        companyName,
        categories: selectedCategories
      });
      message.success("You're subscribed! Redirecting...");
      navigate('/demo');
    } catch (error) {
      console.error('Error submitting subscription:', error);
      message.error('Something went wrong submitting your subscription. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="subscription-page">
      {/* Navigation */}
      <Header />

      <div className="subscription-container">
        <div className="subscription-header">
          <h1 className="subscription-title">Subscribe to GitHub Trending</h1>
          <p className="subscription-subtitle">
            Get personalized trending repositories based on your interests
          </p>
        </div>

        {/* Category Selection */}
        <div className="category-section">
          <div className="section-heading-row">
            <h2 className="section-title">Choose Your Interests</h2>
            {selectedCategories.length > 0 && (
              <span className="category-count">{selectedCategories.length} selected</span>
            )}
          </div>
          <p className="section-subtitle">
            Select the categories you're interested in to get personalized trending repositories
          </p>
          <div className="category-chip-grid">
            {categories.map((category) => {
              const isSelected = selectedCategories.includes(category.id);
              return (
                <button
                  key={category.id}
                  type="button"
                  className={`category-chip btn-surface ${isSelected ? 'selected' : ''}`}
                  title={category.description}
                  onClick={() => {
                    if (isSelected) {
                      setSelectedCategories(selectedCategories.filter(id => id !== category.id));
                    } else {
                      setSelectedCategories([...selectedCategories, category.id]);
                    }
                  }}
                >
                  <span className="chip-icon">{category.icon}</span>
                  <span className="chip-name">{category.name}</span>
                  {isSelected && <CheckOutlined className="chip-check" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* User Information */}
        <div className="user-info-section">
          <h2 className="section-title">Your Information</h2>
          <p className="section-subtitle">
            We'll only use this to personalize your trending digest.
          </p>
          <div className="user-form-panel">
            <div className="user-form-grid">
              <div className="form-group">
                <div className="form-label-row">
                  <label className="form-label">Your Name</label>
                  <span className="field-tag required">Required</span>
                </div>
                <Input
                  size="large"
                  placeholder="Jane Doe"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  onBlur={() => markTouched('userName')}
                  className="form-input"
                  status={nameError ? 'error' : ''}
                  prefix={<UserOutlined />}
                  suffix={userName.trim() && !nameError ? <CheckCircleFilled className="field-valid-icon" /> : null}
                />
                {nameError && <span className="field-error">{nameError}</span>}
              </div>
              <div className="form-group">
                <div className="form-label-row">
                  <label className="form-label">Email Address</label>
                  <span className="field-tag required">Required</span>
                </div>
                <Input
                  size="large"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => markTouched('email')}
                  className="form-input"
                  status={emailError ? 'error' : ''}
                  prefix={<MailOutlined />}
                  suffix={isEmailValid && !emailError ? <CheckCircleFilled className="field-valid-icon" /> : null}
                />
                {emailError && <span className="field-error">{emailError}</span>}
              </div>
              <div className="form-group">
                <div className="form-label-row">
                  <label className="form-label">GitHub Username</label>
                  <span className="field-tag optional">Optional</span>
                </div>
                <Input
                  size="large"
                  placeholder="your-github-username"
                  value={githubUsername}
                  onChange={(e) => setGithubUsername(e.target.value)}
                  className="form-input"
                  prefix={<GithubOutlined />}
                />
              </div>
              <div className="form-group">
                <div className="form-label-row">
                  <label className="form-label">Company Name</label>
                  <span className="field-tag optional">Optional</span>
                </div>
                <Input
                  size="large"
                  placeholder="Acme Inc."
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="form-input"
                  prefix={<BankOutlined />}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Subscribe Button */}
        <div className="subscribe-section">
          <Button
            type="primary"
            size="large"
            className="subscribe-button"
            onClick={handleSubscribe}
            icon={<RocketOutlined />}
            disabled={!userName.trim() || !isEmailValid || selectedCategories.length === 0}
            loading={submitting}
          >
            Subscribe Now
          </Button>
          <p className="subscribe-note">
            You'll be redirected to complete your subscription setup
          </p>
        </div>
      </div>

      <SectionDivider from="rgb(var(--c-accent) / 0.5)" to="rgb(var(--c-accent) / 0.5)" spaced />

      <DailyOverviewSection />

      <SectionDivider from="rgb(var(--c-accent) / 0.5)" to="rgb(20 184 166 / 0.5)" spaced />

      <RanbotPromoSection />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default SubscriptionPage;
