import 'package:flutter/material.dart';
import 'package:file_picker/file_picker.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:syncfusion_flutter_pdf/pdf.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'dart:io';

const kLocalHostUrl = 'http://10.0.2.2:11434/api/generate';
const kAiModel = 'qwen2.5:0.5b';

const kSystemPrompt = '''
You are an intelligent AI study companion. Your capabilities include:
1. PDF Analysis:
   - Extracting key points and summaries
   - Creating study notes
   - Generating practice quizzes

2. Learning Support:
   - Explaining complex topics in simple terms
   - Creating flashcards
   - Providing study strategies
   - Answering questions about study materials

3. Content Enhancement:
   - Summarizing articles and documents
   - Breaking down difficult concepts
   - Providing examples and analogies

Please maintain an educational and supportive tone in all interactions.
''';

class PdfInteractionScreen extends ConsumerStatefulWidget {
  @override
  _PdfInteractionScreenState createState() => _PdfInteractionScreenState();
}

class _PdfInteractionScreenState extends ConsumerState<PdfInteractionScreen> {
  String _pdfText = '';
  bool _isLoading = false;
  String _summary = '';

  /// Function to load PDF from file picker and extract text using `syncfusion_flutter_pdf`
  Future<void> _loadPdf() async {
    try {
      setState(() {
        _isLoading = true;
        _summary = '';
        _pdfText = '';
      });

      FilePickerResult? result = await FilePicker.platform.pickFiles(
        allowMultiple: false,
        type: FileType.custom,
        allowedExtensions: ['pdf'],
      );

      if (result != null) {
        final filePath = result.files.single.path!;
        final File file = File(filePath);
        final List<int> bytes = await file.readAsBytes();

        // Load the PDF document using Syncfusion
        PdfDocument document = PdfDocument(inputBytes: bytes);
        
        String text = PdfTextExtractor(document).extractText();
        
        setState(() {
          _pdfText = text;
        });

        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('PDF loaded successfully!')),
        );

        // Dispose the document to avoid memory leaks
        document.dispose();
      }
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error loading PDF: $e')),
      );
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  /// Function to send extracted text to Ollama API for summarization
  Future<void> _summarizeText() async {
    if (_pdfText.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Please load a PDF first!')),
      );
      return;
    }

    try {
      setState(() {
        _isLoading = true;
      });

      final response = await http.post(
        Uri.parse(kLocalHostUrl),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'model': kAiModel,
          'system_prompt': kSystemPrompt,
          'user_prompt': 'Summarize the following text: $_pdfText',
        }),
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        setState(() {
          _summary = data['summary'] ?? 'No summary available';
        });

        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Summary generated successfully!')),
        );
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Failed to generate summary')),
        );
      }
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error during summarization: $e')),
      );
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('PDF Interaction'),
        backgroundColor: Color(0xFF4A56E2),
      ),
      body: Container(
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [const Color.fromARGB(255, 222, 60, 60), Color(0xFFEFF2FF)],
          ),
        ),
        child: Padding(
          padding: EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              ElevatedButton.icon(
                onPressed: _loadPdf,
                icon: Icon(Icons.picture_as_pdf),
                label: Text('Load PDF'),
                style: ElevatedButton.styleFrom(
                  backgroundColor: Color(0xFF4A56E2),
                  padding: EdgeInsets.symmetric(vertical: 12, horizontal: 20),
                ),
              ),
              SizedBox(height: 16),
              Expanded(
                child: _isLoading
                    ? Center(child: CircularProgressIndicator())
                    : _pdfText.isNotEmpty
                        ? SingleChildScrollView(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  'PDF Content',
                                  style: TextStyle(
                                    fontSize: 20,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                                SizedBox(height: 8),
                                Text(
                                  _pdfText.length > 500
                                      ? '${_pdfText.substring(0, 500)}...'
                                      : _pdfText,
                                  style: TextStyle(fontSize: 16),
                                ),
                                SizedBox(height: 16),
                                ElevatedButton(
                                  onPressed: _summarizeText,
                                  child: Text('Summarize PDF Text'),
                                  style: ElevatedButton.styleFrom(
                                    backgroundColor: Color(0xFF4A56E2),
                                    padding: EdgeInsets.symmetric(vertical: 12, horizontal: 20),
                                  ),
                                ),
                              ],
                            ),
                          )
                        : Center(
                            child: Text(
                              'Load a PDF to view its content',
                              style: TextStyle(
                                fontSize: 16,
                                color: Colors.grey[700],
                              ),
                            ),
                          ),
              ),
              SizedBox(height: 16),
              if (_summary.isNotEmpty) ...[
                Text(
                  'Summary',
                  style: TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                SizedBox(height: 8),
                Expanded(
                  child: SingleChildScrollView(
                    child: Text(
                      _summary,
                      style: TextStyle(fontSize: 16),
                    ),
                  ),
                ),
              ],
            ],
          ),
        ),
      ),
    );
  }
}
