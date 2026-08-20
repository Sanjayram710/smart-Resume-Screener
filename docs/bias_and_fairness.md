# Algorithmic Fairness & Bias Mitigation Policy

## Core Principle

The **Smart Resume Screener** is engineered to evaluate candidates strictly on technical competence, verified career experience, and objective role requirements. **Protected personal attributes and irrelevant demographic details are structurally prevented from affecting match scores or rankings.**

---

## Protected Demographic Attributes Explicitly Ignored & Redacted

1. **Gender & Pronouns** (e.g., Male, Female, Non-binary)
2. **Race, Ethnicity & Caste** (e.g., Brahmin, Dalit, Hispanic, Caucasian)
3. **Religion & Faith** (e.g., Hindu, Muslim, Christian, Jewish, Buddhist, Sikh)
4. **Marital & Familial Status** (e.g., Single, Married, Divorced, Children)
5. **Age & Date of Birth** (e.g., Born in 1995, 28 years old)
6. **Photographs & Appearance** (Physical appearance stripped during text extraction)
7. **Nationality & Citizenship** (Unless legally mandated for national security clearance)

---

## Architectural Safeguards

### 1. Pre-Extraction Regex Redaction
Before any resume text is evaluated by matching algorithms or passed to language models, the `redact_protected_attributes` routine scans for demographic tokens and replaces them with neutral redaction tags `[REDACTED_DEMOGRAPHIC]`.

### 2. Isolated Deterministic Scoring Engine
Numeric scores are calculated purely through deterministic formulas based on skills, verified career duration, education level, and certifications. The scoring engine has no input parameters for gender, age, or demographics.

### 3. System Prompt Constraints
All LLM prompt modules (`resume_extraction.py`, `job_extraction.py`, `candidate_matching.py`) include non-negotiable bias prevention instructions forbidding the model from using personal attributes in qualitative justifications.
