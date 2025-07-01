---
sidebar_position: 1
title: Video Compression
---

## Entropy and redundancy

In all video programs, there are two types of components in the signal: those that are novel and unpredictable and those that can be anticipated. The novel component is called entropy and is the true information in the signal. Redundancy can also be temporal as it is where similarities between successive pictures are used. All compression systems work by separating entropy from redundancy in the encoder. Only the entropy is recorded or transmitted and the decoder computes the redundancy from the transmitted signal. In a simple way, there are similar areas within a single frame and there are similar areas between different frames of video. The areas that are different are ‘entropy’, and areas that are similar are ‘redundant’. This is the core and starting point of the journey through video compression (encoding) and decompression (decoding). The codec is formed with enCODECode, which is an amalgam of words \- encode and decode. The compression is old and is continuously evolving to match with growing video needs in the world. While working on video for mass consumption through different mediums \- TV, mobile, internet \- it is necessary to understand decades old methods to the new age methods. This topic takes a journey through the legacy compression techniques used for traditional TV broadcasting to the latest technologies used for streaming video content.
