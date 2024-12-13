import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_markdown/flutter_markdown.dart';

import 'filter_note_screen.dart';

class NoteScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Color(0xFF5661F6),
        title: Text(
          "Community Notes",
          style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
        ),
      ),
      body: StreamBuilder<QuerySnapshot>(
        stream: FirebaseFirestore.instance.collection('notes').snapshots(),
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return Center(child: CircularProgressIndicator());
          }
          if (!snapshot.hasData) {
            return Center(child: Text("No Notes Found"));
          }

          final notes = snapshot.data!.docs;

          return ListView.builder(
            itemCount: notes.length,
            itemBuilder: (context, index) {
              final note = notes[index];
              final labels = List<String>.from(note['labels']);
              final text = note['text'];

              // Extract the title from the markdown text
              final title = _extractTitle(text);

              // Remove the title line from the text
              final textWithoutTitle = _removeTitleFromText(text);

              return Card(
                  color: Colors.white,
                  margin: EdgeInsets.symmetric(vertical: 8.0, horizontal: 16.0),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12.0),
                  ),
                  elevation: 4,
                  child: ListTile(
                    contentPadding:
                        EdgeInsets.symmetric(horizontal: 16.0, vertical: 12.0),
                    title: Text(
                      title.isNotEmpty ? title : "No Title",
                      style: TextStyle(
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                        color: Color(0xFF5661F6),
                      ),
                    ),
                    subtitle: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        // Display labels as clickable chips
                        Wrap(
                          spacing: 6.0,
                          runSpacing: -8.0,
                          children: labels.map((label) {
                            return InkWell(
                              onTap: () {
                                Navigator.push(
                                  context,
                                  MaterialPageRoute(
                                    builder: (context) =>
                                        FilteredNotesScreen(label: label),
                                  ),
                                );
                              },
                              child: Chip(
                                label: Text(
                                  label,
                                  style: TextStyle(
                                      color: Colors.white, fontSize: 12),
                                ),
                                backgroundColor: Color(0xFF4A56E2),
                              ),
                            );
                          }).toList(),
                        ),
                        SizedBox(height: 8),
                        Text(
                          textWithoutTitle.length > 150
                              ? '${textWithoutTitle.substring(0, 150)}...'
                              : textWithoutTitle,
                          maxLines: 3,
                          overflow: TextOverflow.ellipsis,
                          style: TextStyle(
                            fontSize: 16,
                            color: Colors.grey[700],
                          ),
                        ),
                      ],
                    ),
                    trailing: Icon(
                      Icons.arrow_forward_ios,
                      size: 16,
                      color: Colors.grey[600],
                    ),
                    onTap: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (context) => NoteDetailScreen(
                            labels: labels,
                            text: text,
                          ),
                        ),
                      );
                    },
                  ));
            },
          );
        },
      ),
      floatingActionButton: FloatingActionButton(
        backgroundColor: Color(0xFF4A56E2),
        child: Icon(Icons.add),
        onPressed: () {
          Navigator.push(
            context,
            MaterialPageRoute(builder: (context) => AddNoteScreen()),
          );
        },
      ),
    );
  }

  String _extractTitle(String markdownText) {
    final lines = markdownText.split('\n');
    for (final line in lines) {
      if (line.startsWith('#')) {
        return line.replaceAll(RegExp(r'^#+\s*'), '').trim();
      }
    }
    return '';
  }

  String _removeTitleFromText(String markdownText) {
    final lines = markdownText.split('\n');
    // Remove the title line if it starts with '#'
    if (lines.isNotEmpty && lines.first.startsWith('#')) {
      lines.removeAt(0);
    }
    return lines.join('\n').trim();
  }
}

class NoteDetailScreen extends StatelessWidget {
  final List<String> labels;
  final String text;

  NoteDetailScreen({required this.labels, required this.text});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(
          "Note Details",
          style: TextStyle(
            color: Colors.white,
            fontWeight: FontWeight.bold,
          ),
        ),
        backgroundColor: Color(0xFF5661F6),
        iconTheme: IconThemeData(color: Colors.white),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Labels as Chips
            Wrap(
              spacing: 6.0,
              runSpacing: -8.0,
              children: labels.map((label) {
                return Chip(
                  label: Text(
                    label,
                    style: TextStyle(color: Colors.white, fontSize: 12),
                  ),
                  backgroundColor: Color(0xFF4A56E2),
                );
              }).toList(),
            ),
            SizedBox(height: 16),
            // Divider
            Divider(
              color: Colors.grey[400],
              thickness: 1,
            ),
            SizedBox(height: 16),
            // Markdown Content
            Container(
              padding: EdgeInsets.all(12.0),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(12.0),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black12,
                    blurRadius: 4,
                    offset: Offset(0, 2),
                  ),
                ],
              ),
              child: MarkdownBody(
                data: text,
                styleSheet: MarkdownStyleSheet(
                  p: TextStyle(
                    fontSize: 16,
                    height: 1.5,
                    color: Colors.grey[800],
                  ),
                  h1: TextStyle(
                    fontSize: 24,
                    fontWeight: FontWeight.bold,
                    color: Color(0xFF3E4C6F),
                  ),
                  h2: TextStyle(
                    fontSize: 22,
                    fontWeight: FontWeight.bold,
                    color: Color(0xFF3E4C6F),
                  ),
                  blockquote: TextStyle(
                    fontSize: 16,
                    fontStyle: FontStyle.italic,
                    color: Colors.grey[700],
                  ),
                  // ...additional styles if needed...
                ),
              ),
            ),
            SizedBox(height: 24),
            // Copy Button
            Align(
              alignment: Alignment.centerRight,
              child: ElevatedButton.icon(
                onPressed: () {
                  Clipboard.setData(ClipboardData(text: text));
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(content: Text('Note copied to clipboard')),
                  );
                },
                icon: Icon(Icons.copy),
                label: Text('Copy Note'),
                style: ElevatedButton.styleFrom(
                  backgroundColor: Color(0xFF4A56E2),
                  padding: EdgeInsets.symmetric(horizontal: 20, vertical: 12),
                  textStyle: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                  ),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(8.0),
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class AddNoteScreen extends StatelessWidget {
  final TextEditingController labelsController = TextEditingController();
  final TextEditingController textController = TextEditingController();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text("Add Note")),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            TextField(
              controller: labelsController,
              decoration:
                  InputDecoration(labelText: "Labels (comma-separated)"),
            ),
            TextField(
              controller: textController,
              decoration:
                  InputDecoration(labelText: "Text (Markdown supported)"),
              maxLines: 5,
            ),
            SizedBox(height: 20),
            ElevatedButton(
              onPressed: () async {
                final labels = labelsController.text
                    .split(',')
                    .map((e) => e.trim())
                    .toList();
                final text = textController.text;

                await FirebaseFirestore.instance.collection('notes').add({
                  'labels': labels,
                  'text': text,
                });

                Navigator.pop(context);
              },
              child: Text("Add Note"),
            ),
          ],
        ),
      ),
    );
  }
}
