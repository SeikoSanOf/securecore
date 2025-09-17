import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { FileText, Shield, Search, Download, Eye, Trash2, Calendar, Clock } from 'lucide-react';

const Reports = () => {
  const osintReports = [
    {
      id: 1,
      title: "Domain Analysis - example.com",
      type: "OSINT",
      status: "Completed",
      date: "2024-01-15",
      time: "14:30",
      findings: 5,
      severity: "Medium"
    },
    {
      id: 2,
      title: "Social Media Scan - @target",
      type: "OSINT", 
      status: "In Progress",
      date: "2024-01-16",
      time: "09:15",
      findings: 2,
      severity: "Low"
    }
  ];

  const pentestReports = [
    {
      id: 3,
      title: "SSL/TLS Security Check",
      type: "Pentest",
      status: "Completed",
      date: "2024-01-14",
      time: "16:45",
      findings: 3,
      severity: "High"
    },
    {
      id: 4,
      title: "Port Scan - 192.168.1.1",
      type: "Pentest",
      status: "Failed",
      date: "2024-01-13",
      time: "11:20",
      findings: 0,
      severity: "N/A"
    }
  ];

  const allReports = [...osintReports, ...pentestReports].sort((a, b) => 
    new Date(b.date + ' ' + b.time).getTime() - new Date(a.date + ' ' + a.time).getTime()
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'In Progress': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'Failed': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'High': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'Medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'Low': return 'bg-green-500/20 text-green-400 border-green-500/30';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getTypeIcon = (type: string) => {
    return type === 'OSINT' ? <Search className="w-4 h-4" /> : <Shield className="w-4 h-4" />;
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
            Rapports
          </h1>
          <p className="text-muted-foreground mt-2">
            Historique et résultats de vos scans OSINT et Pentest
          </p>
        </div>
        <Button className="glass-button">
          <Download className="w-4 h-4 mr-2" />
          Exporter tout
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="glass-card border-0">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-lg bg-primary/20">
                <FileText className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{allReports.length}</p>
                <p className="text-sm text-muted-foreground">Rapports totaux</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-0">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-lg bg-green-500/20">
                <Search className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{osintReports.length}</p>
                <p className="text-sm text-muted-foreground">Scans OSINT</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-0">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-lg bg-blue-500/20">
                <Shield className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{pentestReports.length}</p>
                <p className="text-sm text-muted-foreground">Tests Pentest</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-0">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-lg bg-red-500/20">
                <FileText className="w-6 h-6 text-red-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {allReports.reduce((sum, report) => sum + report.findings, 0)}
                </p>
                <p className="text-sm text-muted-foreground">Vulnérabilités</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reports Table */}
      <Card className="glass-card border-0">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="w-5 h-5" />
            <span>Historique des rapports</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-white/10">
                <TableHead>Type</TableHead>
                <TableHead>Titre</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Résultats</TableHead>
                <TableHead>Sévérité</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allReports.map((report) => (
                <TableRow key={report.id} className="border-white/10">
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {getTypeIcon(report.type)}
                      <span className="text-sm">{report.type}</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{report.title}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(report.status)}>
                      {report.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span>{report.date}</span>
                      <Clock className="w-4 h-4 ml-2" />
                      <span>{report.time}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">{report.findings} résultats</span>
                  </TableCell>
                  <TableCell>
                    {report.severity !== 'N/A' ? (
                      <Badge className={getSeverityColor(report.severity)}>
                        {report.severity}
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground">N/A</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-400 hover:text-red-300">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Reports;