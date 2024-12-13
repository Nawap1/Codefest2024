import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter/material.dart';

import 'note_screen.dart';
class FilteredNotesScreen extends StatelessWidget {
  final String label;

  FilteredNotesScreen({required this.label});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(
          "Notes with \"$label\"",
          style: TextStyle(
            color: Colors.white,
            fontWeight: FontWeight.bold,
          ),
        ),
        backgroundColor: Color(0xFF5661F6),
      ),
      body: StreamBuilder<QuerySnapshot>(
        stream: FirebaseFirestore.instance
            .collection('notes')
            .where('labels', arrayContains: label)
            .snapshots(),
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return Center(child: CircularProgressIndicator());
          }
          if (!snapshot.hasData || snapshot.data!.docs.isEmpty) {
            return Center(child: Text("No Notes Found with \"$label\""));
          }

          final notes = snapshot.data!.docs;

          return ListView.builder(
            itemCount: notes.length,
            itemBuilder: (context, index) {
              final note = notes[index];
              final noteLabels = List<String>.from(note['labels']);
              final noteText = note['text'];
              final title = _extractTitle(noteText);
              final textWithoutTitle = _removeTitleFromText(noteText);

              return Card(
                color: Colors.white,
                margin: EdgeInsets.symmetric(vertical: 8.0, horizontal: 16.0),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12.0),
                ),
                elevation: 4,
                child: ListTile(
                  contentPadding: EdgeInsets.symmetric(horizontal: 16.0, vertical: 12.0),
                  title: Text(
                    title.isNotEmpty ? title : "No Title",
                    style: TextStyle(
                      fontSize: 20,
                      fontWeight: FontWeight.bold,
                      color: Color(0xFF5661F6),
                    ),
                  ),
                  subtitle: Text(
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
                          labels: noteLabels,
                          text: noteText,
                        ),
                      ),
                    );
                  },
                ),
              );
            },
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
    if (lines.isNotEmpty && lines.first.startsWith('#')) {
      lines.removeAt(0);
    }
    return lines.join('\n').trim();
  }
}
