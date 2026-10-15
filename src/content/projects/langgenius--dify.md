---
title: "langgenius/dify"
owner: "langgenius"
name: "dify"
fullName: "langgenius/dify"
description: "Build Agentic workflows, RAG pipelines, with rich AI model and tool support on one collaborative workspace. Deploy on cloud, VPC, or self-hosted, so teams move from prototype to production without rebuilding the stack."
sourceUrl: "https://github.com/langgenius/dify"
stars: 152403
forks: 24054
language: "TypeScript"
topics: ["agent", "agentic-ai", "agentic-framework", "agentic-workflow", "ai", "automation", "claude", "genai"]
license: "NOASSERTION"
homepage: "https://dify.ai"
defaultBranch: "main"
snapshotDate: "2026-08-14"
pushedAt: "2026-08-14T05:34:30Z"
---

> 本页保存的是公开项目资料快照，阅读过程不需要连接 GitHub。

*图片：cover-v5-optimized*


  Dify Cloud ·
  Self-hosting ·
  Documentation ·
  Dify edition overview


    
        
    
        
    
        
    
        
    
        
    
        
    
        
    
        
    
        
    
        
    
        
    
        
    
        


  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  


Dify is an open-source LLM app development platform. Its intuitive interface combines AI workflow, RAG pipeline, agent capabilities, model management, observability features (including [Opik](https://www.comet.com/docs/opik/integrations/dify), [Langfuse](https://docs.langfuse.com), and [Arize Phoenix](https://docs.arize.com/phoenix)) and more, letting you quickly go from prototype to production. Here's a list of the core features:

## Quick start

> Before installing Dify, make sure your machine meets the following minimum system requirements:
>
> - CPU >= 2 Core
> - RAM >= 4 GiB


The easiest way to start the Dify server is through Docker Compose. Before running Dify with the following commands, make sure that [Docker](https://docs.docker.com/get-docker/) and Docker Compose v2.24.0 or later are installed on your machine:

```bash
cd dify
cd docker
cp .env.example .env
docker compose up -d
```

After running, you can access the Dify dashboard in your browser at http://localhost/install and start the initialization process.

#### Seeking help

Please refer to our [FAQ](https://docs.dify.ai/getting-started/install-self-hosted/faqs) if you encounter problems setting up Dify. Reach out to the community and us if you are still having issues.

> If you'd like to contribute to Dify or do additional development, refer to our [guide to deploying from source code](https://docs.dify.ai/getting-started/install-self-hosted/local-source-code)

## Key features

**1. Workflow**:
Build and test powerful AI workflows on a visual canvas, leveraging all the following features and beyond.

**2. Comprehensive model support**:
Seamless integration with hundreds of proprietary / open-source LLMs from dozens of inference providers and self-hosted solutions, covering GPT, Mistral, Llama3, and any OpenAI API-compatible models. A full list of supported model providers can be found [here](https://docs.dify.ai/getting-started/readme/model-providers).

*图片：providers-v5*

**3. Prompt IDE**:
Intuitive interface for crafting prompts, comparing model performance, and adding additional features such as text-to-speech to a chat-based app.

**4. RAG Pipeline**:
Extensive RAG capabilities that cover everything from document ingestion to retrieval, with out-of-box support for text extraction from PDFs, PPTs, and other common document formats.

**5. Agent capabilities**:
You can define agents based on LLM Function Calling or ReAct, and add pre-built or custom tools for the agent. Dify provides 50+ built-in tools for AI agents, such as Google Search, DALL·E, Stable Diffusion and WolframAlpha.

**6. LLMOps**:
Monitor and analyze application logs and performance over time. You could continuously improve prompts, datasets, and models based on production data and annotations.

**7. Backend-as-a-Service**:
All of Dify's offerings come with corresponding APIs, so you could effortlessly integrate Dify into your own business logic.

## Using Dify

- **Cloud **
  We host a [Dify Cloud](https://dify.ai) service for anyone to try with zero setup. It provides all the capabilities of the self-deployed version, and includes 200 free GPT-4 calls in the sandbox plan. If you run into issues with Dify Cloud, contact our Cloud support team.

- **Self-hosting Dify Community Edition**
  Quickly get Dify running in your environment with this starter guide.
  Use our [documentation](https://docs.dify.ai) for further references and more in-depth instructions.

- **Dify for enterprise / organizations**
  We provide additional enterprise-centric features. Send us an email to discuss your enterprise needs. 

## Staying ahead

Star Dify on GitHub and be instantly notified of new releases.

*图片：star-us*

## Advanced Setup

### Custom configurations

If you need to customize the configuration, edit `docker/.env`. The essential startup defaults live in `docker/.env.example`, and optional advanced variables are split under `docker/envs/` by theme. After making any changes, re-run `docker compose up -d` from the `docker` directory. You can find the full list of available environment variables [here](https://docs.dify.ai/getting-started/install-self-hosted/environments).

### Metrics Monitoring with Grafana

Import the dashboard to Grafana, using Dify's PostgreSQL database as data source, to monitor metrics in granularity of apps, tenants, messages, and more.

- Grafana Dashboard by @bowenliang123

### Deployment with Kubernetes

If you'd like to configure a highly available setup, there are community-contributed [Helm Charts](https://helm.sh/) and YAML files which allow Dify to be deployed on Kubernetes.

- Helm Chart by @LeoQuote
- Helm Chart by @BorisPolonsky
- Helm Chart by @magicsong
- YAML file by @Winson-030
- YAML file by @wyy-holding
- 🚀 NEW! YAML files (Supports Dify v1.6.0) by @Zhoneym

#### Using Terraform for Deployment

Deploy Dify to Cloud Platform with a single click using [terraform](https://www.terraform.io/)

##### Azure Global

- Azure Terraform by @nikawang

##### Google Cloud

- Google Cloud Terraform by @sotazum

#### Using AWS CDK for Deployment

Deploy Dify to AWS with [CDK](https://aws.amazon.com/cdk/)

##### AWS

- AWS CDK by @KevinZhao (EKS based)
- AWS CDK by @tmokmss (ECS based)

#### Using Alibaba Cloud Computing Nest

Quickly deploy Dify to Alibaba cloud with [Alibaba Cloud Computing Nest](https://computenest.console.aliyun.com/service/instance/create/default?type=user&ServiceName=Dify%E7%A4%BE%E5%8C%BA%E7%89%88)

#### Using Alibaba Cloud Data Management

One-Click deploy Dify to Alibaba Cloud with [Alibaba Cloud Data Management](https://www.alibabacloud.com/help/en/dms/dify-in-invitational-preview/)

#### Deploy to AKS with Azure Devops Pipeline

One-Click deploy Dify to AKS with Azure Devops Pipeline Helm Chart by @LeoZhang

## Contributing

For those who'd like to contribute code, see our Contribution Guide.
At the same time, please consider supporting Dify by sharing it on social media and at events and conferences.

> We are looking for contributors to help translate Dify into languages other than Mandarin or English. If you are interested in helping, please see the i18n README for more information, and leave us a comment in the `global-users` channel of our [Discord Community Server](https://discord.gg/8Tpq4AcN9c).

## Community & contact

- GitHub Discussion. Best for: sharing feedback and asking questions.
- GitHub Issues. Best for: bugs you encounter using Dify.AI, and feature proposals. See our Contribution Guide.
- [Discord](https://discord.gg/FngNHpbcY7). Best for: sharing your applications and hanging out with the community.
- [X(Twitter)](https://twitter.com/dify_ai). Best for: sharing your applications and hanging out with the community.

**Contributors**


  


## Star History


 
   
   
   
 


## Security disclosure

To protect your privacy, please avoid posting security issues on GitHub. Instead, report issues to security@dify.ai, and our team will respond with detailed answer.

## License

This repository is licensed under the Dify Open Source License, based on Apache 2.0 with additional conditions.
