---
date: '2026-09-18'
slug: scaling-law-next-architecture
title: '从 Scaling Law 到下一代架构：大模型的演进'
summary: '当参数、数据与算力的“三驾马车”逐渐逼近边际收益递减，大模型的下一步会走向哪里？本文梳理 Scaling Law 的来龙去脉，并讨论 MoE、状态空间模型与测试时计算等新方向。'
categories:
  - 大模型
  - 论文解读
image: /img/cover-scaling.png
imageAlt: ''
---

过去五年，大语言模型的进步很大程度上可以用一句话概括：**更大的模型、更多的数据、更多的算力**。这背后的理论支撑，就是被反复引用的 Scaling Law（规模定律）。但到了今天，越来越多的研究者开始追问：这条曲线还能延伸多远？下一代架构又会长什么样？

## 一、Scaling Law 到底说了什么

2020 年，Kaplan 等人在 OpenAI 发表的论文中观察到，语言模型的测试损失 L 与参数量 N、数据量 D、计算量 C 之间呈现出稳定的**幂律关系**：

```text
L(N) ≈ (N_c / N)^α_N
L(D) ≈ (D_c / D)^α_D
L(C) ≈ (C_c / C)^α_C
```

这意味着，只要持续增加资源，损失就会以可预测的方式下降。更重要的是，它让“训练一个更大的模型”从一场赌博变成了一项**可规划的工程**。

2022 年，DeepMind 的 Chinchilla 论文修正了这一结论：在固定计算预算下，参数量与训练 token 数应当**同比例扩展**，经验上大约是每个参数对应 20 个 token。许多早期的大模型其实是“训练不足”的。

> Scaling Law 的真正价值不在于“越大越好”，而在于它让我们能在小规模实验上预测大规模训练的结果。

## 二、为什么说边际收益正在递减

幂律曲线有一个天然特性：在对数坐标上是一条直线，但在线性坐标上，每一次同等幅度的提升都需要**指数级增长的资源**。当前面临的瓶颈主要有三个：

1. **高质量数据枯竭**：公开互联网上可用的高质量文本估计在数十万亿 token 量级，头部模型已经接近这一上限。
2. **算力与能耗成本**：单次前沿训练的成本已达数亿美元，电力与芯片供给成为现实约束。
3. **能力与损失的错位**：困惑度（perplexity）的下降并不总能线性转化为推理、规划等高阶能力的提升。

## 三、下一代架构的几条路线

### 1. 混合专家模型（MoE）

MoE 的核心思想是“**参数多，但每次只激活一部分**”。通过路由网络为每个 token 选择少数几个专家，可以在推理成本基本不变的前提下大幅扩展总参数量。

```python
import torch
import torch.nn as nn
import torch.nn.functional as F

class TopKRouter(nn.Module):
    def __init__(self, d_model: int, n_experts: int, k: int = 2):
        super().__init__()
        self.gate = nn.Linear(d_model, n_experts, bias=False)
        self.k = k

    def forward(self, x: torch.Tensor):
        logits = self.gate(x)                      # [batch, seq, n_experts]
        weights, indices = logits.topk(self.k, dim=-1)
        weights = F.softmax(weights, dim=-1)       # 只在被选中的专家间归一化
        return weights, indices
```

MoE 的挑战在于负载均衡与通信开销：如果路由总是偏向少数专家，模型容量就被浪费了。

### 2. 状态空间模型与线性注意力

Transformer 的自注意力复杂度是 O(n²)，对超长上下文非常不友好。以 Mamba 为代表的**选择性状态空间模型**将复杂度降至线性，同时保留了对上下文的选择性记忆能力。当前更务实的方向是**混合架构**：少量注意力层负责精确检索，大量状态空间层负责高效建模长序列。

### 3. 测试时计算（Test-time Compute）

这可能是近两年最重要的范式转变。与其只在训练阶段堆算力，不如**在推理阶段让模型“多想一会儿”**。通过思维链、自我验证、搜索与强化学习，模型可以把更多计算花在困难问题上。

研究表明，在数学与代码等可验证任务上，增加推理时的计算量同样呈现出类似 Scaling Law 的规律——这被称为**第二条规模曲线**。

## 四、我的几点判断

- **规模仍然重要，但不再是唯一变量**。数据质量、合成数据与课程设计的作用正在上升。
- **架构会走向混合**。纯 Transformer 的统治地位会被“注意力 + 线性序列模型 + MoE”的组合方案逐步替代。
- **推理时计算是新的增长引擎**。未来衡量模型的指标，可能不只是参数量，而是“每单位推理算力能换来多少能力”。

## 结语

Scaling Law 告诉我们方向，却没有告诉我们终点。真正有意思的问题已经从“还能做多大”转向“如何更聪明地使用每一份计算”。这也是我接下来会持续关注和记录的主题。

## 参考阅读

- Kaplan et al., *Scaling Laws for Neural Language Models*, 2020
- Hoffmann et al., *Training Compute-Optimal Large Language Models*, 2022
- Gu & Dao, *Mamba: Linear-Time Sequence Modeling with Selective State Spaces*, 2023
- Snell et al., *Scaling LLM Test-Time Compute Optimally*, 2024
