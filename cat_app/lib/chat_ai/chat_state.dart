import 'dart:convert';
import 'dart:io';

import 'package:file_picker/file_picker.dart';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:syncfusion_flutter_pdf/pdf.dart';

import 'chat_message.dart';
import 'consts.dart';

class ChatState {
  final List<ChatMessage> messages;
  final bool isLoading;
  final TextEditingController textEditingController;

  ChatState({
    required this.messages,
    required this.isLoading,
    required this.textEditingController,
  });

  ChatState copyWith({
    List<ChatMessage>? messages,
    bool? isLoading,
  }) {
    return ChatState(
      messages: messages ?? this.messages,
      isLoading: isLoading ?? this.isLoading,
      textEditingController: textEditingController,
    );
  }
}

class ChatStateNotifier extends StateNotifier<ChatState> {
  ChatStateNotifier()
      : super(ChatState(
            messages: [],
            isLoading: false,
            textEditingController: TextEditingController()));

  Future<void> sendMessage([String initialMessage = '']) async {
    final message = initialMessage.isNotEmpty
        ? initialMessage
        : state.textEditingController.text.trim();
    if (message.isEmpty) return;

    await _processMessage(message: message);
  }

  Future<void> uploadFile(PlatformFile file) async {
    state = state.copyWith(isLoading: true);

    try {
      if (file.path == null || file.size > 104857600) {
        throw Exception('Failed to read file: ${file.name}');
      }

      // Load the PDF document using Syncfusion
      final File pdfFile = File(file.path!);
      final List<int> bytes = await pdfFile.readAsBytes();
      PdfDocument document = PdfDocument(inputBytes: bytes);
      String text = PdfTextExtractor(document).extractText();
      document.dispose();

      // Format the extracted text for readability
      String formattedText = _formatText(text);

      state = state.copyWith(messages: [
        ChatMessage(
            text: 'PDF uploaded successfully: ${file.name}\n\nExtracted Text:\n$formattedText',
            isUser: false),
        ...state.messages,
      ]);
    } catch (e) {
      state = state.copyWith(messages: [
        ChatMessage(
            text:
                'An error occurred while processing the file. Please try again.',
            isUser: false),
        ...state.messages,
      ]);
    } finally {
      state = state.copyWith(isLoading: false);
    }
  }

  String _formatText(String text) {
    // Simple formatting for readability
    return text.replaceAll('\n', '\n\n').replaceAll(RegExp(r'\s+'), ' ');
  }

  Future<void> _processMessage({
    String message = '',
    String fileName = '',
    String fileContent = '',
  }) async {
    state = state.copyWith(isLoading: true);
    state.textEditingController.clear();

    final userMessage = ChatMessage(
      text: '$message $fileName',
      isUser: true,
    );
    state = state.copyWith(messages: [userMessage, ...state.messages]);

    try {
      final response = await http.post(
        Uri.parse(kLocalHostUrl),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'model': kAiModel,
          'prompt': '$kSystemPrompt\n$message $fileContent',
          //TODO: Add streaming support
          'stream': false,
        }),
        
      );

      if (response.statusCode == 200) {
        final jsonResponse = jsonDecode(response.body);
        final aiMessage =
            ChatMessage(text: jsonResponse['response'], isUser: false);
        state = state.copyWith(messages: [aiMessage, ...state.messages]);
      } else {
        throw Exception('Failed to load response');
      }
    } catch (e) {
      state = state.copyWith(messages: [
        ChatMessage(
            text: 'An error occurred. Please try again.', isUser: false),
        ...state.messages,
      ]);
    } finally {
      state = state.copyWith(isLoading: false);
    }
  }
}

final chatStateProvider = StateNotifierProvider<ChatStateNotifier, ChatState>(
  (ref) => ChatStateNotifier(),
);
