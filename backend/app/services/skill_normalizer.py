import re
from typing import Dict, List, Set, Tuple


class SkillNormalizer:
    """
    Standardizes skill names, manages canonical technology aliases,
    and computes deterministic skill-to-skill similarity.
    """

    # Mapping of raw variants / abbreviations to their canonical representation
    SKILL_ALIASES: Dict[str, str] = {
        # Languages
        "python3": "python",
        "py": "python",
        "golang": "go",
        "golang/go": "go",
        "js": "javascript",
        "ts": "typescript",
        "c++": "c++",
        "cpp": "c++",
        "c#": "c#",
        "csharp": "c#",
        "ruby on rails": "ruby on rails",
        "ror": "ruby on rails",
        # Frontend
        "react.js": "react",
        "reactjs": "react",
        "react native": "react native",
        "vue.js": "vue",
        "vuejs": "vue",
        "angular.js": "angular",
        "angularjs": "angular",
        "next.js": "next.js",
        "nextjs": "next.js",
        "tailwind": "tailwind css",
        "tailwindcss": "tailwind css",
        "html5": "html",
        "css3": "css",
        "sass/scss": "scss",
        # Backend & Frameworks
        "fastapi": "fastapi",
        "fast-api": "fastapi",
        "django rest framework": "django rest framework",
        "drf": "django rest framework",
        "django": "django",
        "flask": "flask",
        "node": "node.js",
        "nodejs": "node.js",
        "express": "express.js",
        "express.js": "express.js",
        "expressjs": "express.js",
        "spring boot": "spring boot",
        "springboot": "spring boot",
        ".net core": ".net",
        "dotnet": ".net",
        "asp.net": ".net",
        # Databases & Storage
        "postgres": "postgresql",
        "postgresql": "postgresql",
        "psql": "postgresql",
        "mongo": "mongodb",
        "mongodb": "mongodb",
        "ms sql": "sql server",
        "mssql": "sql server",
        "redis cache": "redis",
        "dynamodb": "dynamodb",
        "elasticsearch": "elasticsearch",
        # Cloud & DevOps
        "aws": "amazon web services",
        "amazon web services": "amazon web services",
        "gcp": "google cloud platform",
        "google cloud": "google cloud platform",
        "azure": "microsoft azure",
        "k8s": "kubernetes",
        "kubernetes": "kubernetes",
        "docker": "docker",
        "docker compose": "docker",
        "ci/cd": "ci/cd",
        "cicd": "ci/cd",
        "github actions": "github actions",
        "jenkins": "jenkins",
        "terraform": "terraform",
        # Architecture & Practices
        "rest": "rest api",
        "restful": "rest api",
        "rest api": "rest api",
        "rest apis": "rest api",
        "restful api": "rest api",
        "restful apis": "rest api",
        "graphql": "graphql",
        "microservices": "microservices",
        "system design": "system design",
        "distributed systems": "distributed systems",
        "tdd": "test driven development",
        "unit testing": "unit testing",
        "agile/scrum": "agile",
        "scrum": "agile",
        # AI / ML
        "ml": "machine learning",
        "machine learning": "machine learning",
        "ai": "artificial intelligence",
        "nlp": "natural language processing",
        "llm": "large language models",
        "llms": "large language models",
        "pytorch": "pytorch",
        "tensorflow": "tensorflow",
        "scikit-learn": "scikit-learn",
        "sklearn": "scikit-learn",
        "pandas": "pandas",
        "numpy": "numpy",
    }

    # Skill Family Mappings (for semantic cluster overlap)
    SKILL_FAMILIES: Dict[str, Set[str]] = {
        "sql_databases": {
            "postgresql",
            "mysql",
            "sqlite",
            "sql server",
            "oracle",
            "mariadb",
            "sql database",
            "relational database",
        },
        "nosql_databases": {"mongodb", "dynamodb", "cassandra", "couchdb", "redis", "nosql"},
        "python_web": {"fastapi", "django", "flask", "tornado", "pyramid", "django rest framework"},
        "js_frontend": {"react", "vue", "angular", "svelte", "next.js", "nuxt.js"},
        "cloud_providers": {"amazon web services", "google cloud platform", "microsoft azure"},
        "container_orchestration": {"docker", "kubernetes", "helm", "openshift"},
        "ml_frameworks": {"pytorch", "tensorflow", "keras", "scikit-learn", "jax", "hugging face"},
    }

    @classmethod
    def clean_skill_string(cls, raw: str) -> str:
        """
        Cleans casing, punctuation, and extraneous spaces from a skill string.
        """
        if not raw:
            return ""
        s = raw.strip().lower()
        # Remove surrounding punctuation except essential symbols like +, #, .
        s = re.sub(r"^[,\-._\s]+|[,\-._\s]+$", "", s)
        # Collapse multiple spaces
        s = re.sub(r"\s+", " ", s)
        return s

    @classmethod
    def normalize(cls, raw_skill: str) -> str:
        """
        Returns the canonical normalized representation of a skill.
        """
        cleaned = cls.clean_skill_string(raw_skill)
        if not cleaned:
            return ""
        return cls.SKILL_ALIASES.get(cleaned, cleaned)

    @classmethod
    def normalize_list(cls, skills: List[str]) -> List[str]:
        """
        Normalizes a list of skills and removes duplicates while preserving order.
        """
        seen: Set[str] = set()
        normalized_list: List[str] = []
        for s in skills:
            norm = cls.normalize(s)
            if norm and norm not in seen:
                seen.add(norm)
                normalized_list.append(norm)
        return normalized_list

    @classmethod
    def compare_skills(cls, candidate_skill: str, target_skill: str) -> Tuple[float, str]:
        """
        Computes match score (0.0 to 1.0) and match_type ('EXACT', 'SEMANTIC', 'PARTIAL', 'NONE')
        between a candidate skill and a target job requirement.
        """
        c_norm = cls.normalize(candidate_skill)
        t_norm = cls.normalize(target_skill)

        if not c_norm or not t_norm:
            return 0.0, "NONE"

        # 1. Exact canonical match
        if c_norm == t_norm:
            return 1.0, "EXACT"

        # 2. Substring / Token containment (e.g. 'react' in 'react native' or 'rest api' vs 'api')
        c_tokens = set(c_norm.split())
        t_tokens = set(t_norm.split())

        if c_tokens == t_tokens:
            return 1.0, "EXACT"

        if t_tokens.issubset(c_tokens) or c_tokens.issubset(t_tokens):
            jaccard = len(c_tokens & t_tokens) / max(len(c_tokens | t_tokens), 1)
            if jaccard >= 0.5:
                return 0.85, "PARTIAL"

        # 3. Check Shared Skill Family (e.g. Postgres vs MySQL or FastAPI vs Django)
        for family_name, members in cls.SKILL_FAMILIES.items():
            if c_norm in members and t_norm in members:
                return 0.80, "SEMANTIC"

        # 4. Token Jaccard overlap
        overlap = len(c_tokens & t_tokens)
        if overlap > 0:
            score = overlap / len(c_tokens | t_tokens)
            if score >= 0.5:
                return 0.70, "PARTIAL"

        return 0.0, "NONE"
