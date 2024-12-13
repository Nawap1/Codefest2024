import 'package:file_picker/file_picker.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter/material.dart';

import 'chat_message.dart';
import 'chat_state.dart';

class ChatScreen extends ConsumerWidget {
  final String initialMessage;

  const ChatScreen({super.key, this.initialMessage = ''});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final chatState = ref.watch(chatStateProvider);
    final colorScheme = Theme.of(context).colorScheme;

    if (initialMessage.isNotEmpty) {
      WidgetsBinding.instance.addPostFrameCallback((_) {
        ref.read(chatStateProvider.notifier).sendMessage(initialMessage);
      });
    }

    return Scaffold(
      appBar: AppBar(
        backgroundColor: Color(0xFF5661F6),
        centerTitle: true,
        title: const Text(
          'Chat with AI',
          style: TextStyle(fontWeight: FontWeight.bold, color: Colors.white),
        ),
      ),
      body: SafeArea(
        child: Center(
          child: ConstrainedBox(
            constraints: const BoxConstraints(maxWidth: 800),
            child: Column(
              children: [
                Expanded(
                  child: Container(
                    color: Color(0xFFEFF2FF),
                    child: ListView.builder(
                      reverse: true,
                      itemCount: chatState.messages.length,
                      itemBuilder: (context, index) {
                        final message = chatState.messages.reversed
                            .toList()[chatState.messages.length - 1 - index];
                        return ChatMessageWidget(message: message);
                      },
                    ),
                  ),
                ),
                if (chatState.isLoading)
                  LinearProgressIndicator(
                    color: colorScheme.secondary,
                    backgroundColor: Color(0xFFEFF2FF),
                  ),
                Container(
                  color: Colors.transparent,
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                  margin: const EdgeInsets.only(top: 8),
                  child: Row(
                    children: [
                      IconButton(
                        icon: const Icon(Icons.attach_file),
                        color: Color(0xFF5661F6),
                        onPressed: () async {
                          FilePickerResult? result =
                              await FilePicker.platform.pickFiles(
                            allowMultiple: false,
                          );
                          if (result != null) {
                            ref
                                .read(chatStateProvider.notifier)
                                .uploadFile(result.files.first);
                          }
                        },
                      ),
                      Expanded(
                        child: TextField(
                          controller: chatState.textEditingController,
                          style: TextStyle(color: Colors.black), // Set text color to black
                          decoration: InputDecoration(
                            hintText: 'How can I help you?',
                            hintStyle: TextStyle(color: Colors.black54), // Set hint text color to black
                            border: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(30),
                              borderSide: BorderSide.none,
                            ),
                            filled: true,
                            fillColor: Colors.white60,
                            contentPadding: const EdgeInsets.symmetric(
                                horizontal: 20, vertical: 10),
                          ),
                          onSubmitted: (value) => ref
                              .read(chatStateProvider.notifier)
                              .sendMessage(),
                        ),
                      ),
                      const SizedBox(width: 8),
                      FloatingActionButton(
                        backgroundColor: Color(0xFF5661F6),
                        mini: true,
                        child: const Icon(Icons.send),
                        onPressed: () =>
                            ref.read(chatStateProvider.notifier).sendMessage(),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
