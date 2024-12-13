import 'dart:convert';
import 'package:file_picker/file_picker.dart';
import 'package:http/http.dart' as http;

import '../chat_ai/consts.dart';

class PdfProcessingService {
  Future<String> processPdf(PlatformFile file, String task) async {
    if (file.bytes == null || file.size > 104857600) {
      throw Exception('Failed to read file: ${file.name}');
    }

    final response = await http.post(
      Uri.parse(kLocalHostUrl),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'model': kAiModel,
        'prompt': '$kSystemPrompt\nTask: $task\nFile Content: ${utf8.decode(file.bytes!)}',
        'stream': false,
      }),
    );

    if (response.statusCode == 200) {
      final jsonResponse = jsonDecode(response.body);
      return jsonResponse['response'];
    } else {
      throw Exception('Failed to process PDF');
    }
  }
}
