# Deterministic Candidate Scoring Formula

## Philosophy

A core requirement of the Smart Resume Screener is **explainable, deterministic scoring**. Numeric candidate scores are **never** fabricated by the LLM. Instead, a multi-stage deterministic scoring engine computes weighted subscores across five key dimensions, while the LLM provides qualitative commentary, strengths, and gap analysis.

---

## Weighting & Dimensions

$$\text{Total Percentage} = (S_{\text{skill}} \times 0.40) + (S_{\text{exp}} \times 0.25) + (S_{\text{sem}} \times 0.20) + (S_{\text{edu}} \times 0.10) + (S_{\text{cert}} \times 0.05)$$

| Component | Weight | Calculation Method | Description |
| :--- | :---: | :--- | :--- |
| **Skill Match** ($S_{\text{skill}}$) | **40%** | $0.75 \times \text{ReqCover} + 0.25 \times \text{PrefCover}$ | Exact token and semantic alias matches against mandatory & preferred job skills |
| **Experience Match** ($S_{\text{exp}}$) | **25%** | $\min(100, (\text{Years}_{\text{cand}} / \text{Years}_{\text{req}}) \times 100)$ | Linear scaling comparing verified candidate seniority against minimum required |
| **Semantic Relevance** ($S_{\text{sem}}$) | **20%** | $\text{CosineSimilarity}(\vec{V}_{\text{cand}}, \vec{V}_{\text{job}}) \times 100$ | Vector embedding similarity comparing overall candidate profile and job description |
| **Education Match** ($S_{\text{edu}}$) | **10%** | Degree Hierarchy Match | 100% for meeting/exceeding requirement, 75% for one level below, 50% baseline |
| **Certification Match** ($S_{\text{cert}}$) | **5%** | Certified Credential Coverage | Matched industry certifications against target preferred certifications |

---

## Conversion to 1.0 – 10.0 Scale

The total percentage score $(0 - 100\%)$ is converted into a standard 1.0 to 10.0 scale:

$$\text{Score}_{1-10} = \max\left(1.0, \min\left(10.0, \text{round}\left(\frac{\text{Total Percentage}}{10.0}, 1\right)\right)\right)$$

### Scale Mapping:
- **$90\% - 100\%$** $\longrightarrow$ **$9.0 - 10.0$**
- **$80\% - 89\%$** $\longrightarrow$ **$8.0 - 8.9$**
- **$70\% - 79\%$** $\longrightarrow$ **$7.0 - 7.9$**
- **$60\% - 69\%$** $\longrightarrow$ **$6.0 - 6.9$**
- **Below $60\%$** $\longrightarrow$ **Below $6.0$**

---

## Shortlisting Decision Rules

Recruiter recommendations are classified using configurable thresholds:

```text
Score >= 7.0         -> SHORTLIST        (High Match, green)
5.0 <= Score < 7.0   -> REVIEW           (Moderate Match, amber)
Score < 5.0          -> NOT_RECOMMENDED  (Weak Match, red/gray)
```
