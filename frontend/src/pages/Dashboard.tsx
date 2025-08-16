import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import {
  Github,
  Slack,
  Plus,
  Settings,
  Bell,
  CheckCircle,
  ExternalLink,
  GitBranch,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

const Dashboard = () => {
  const [isSlackConnected, setIsSlackConnected] = useState(false);
  const [repositories, setRepositories] = useState([]);
  const [isAddRepoModalOpen, setIsAddRepoModalOpen] = useState(false);
  const [selectedRepo, setSelectedRepo] = useState("");
  const [selectedChannel, setSelectedChannel] = useState("");
  const [slackChannels, setSlackChannels] = useState([]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };
  const handleConnectSlack = () => {
    const handleSlackSignIn = async () => {
      try {
        const {
          data: { url: getRedirectUrl },
        } = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/auth/authorize?provider=slack`,
          {
            headers: {
              "x-auth-token": localStorage.getItem("access_Token") ?? "",
            },
          }
        );
        if (!getRedirectUrl) {
          console.error("No redirect URL received from the backend");
          return;
        }
        window.location.href = getRedirectUrl;
      } catch (error) {
        console.error("Error fetching redirect URI:", error);
      }
    };
    handleSlackSignIn();
  };

  const handleAddRepository = async () => {
    try {
      const githubResponse = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/github/repos`,
        {
          headers: {
            "x-auth-token": localStorage.getItem("access_Token") ?? "",
          },
        }
      );
      const slackResponse = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/slack/channel-list`,
        {
          headers: {
            "x-auth-token": localStorage.getItem("access_Token") ?? "",
          },
        }
      );
      if (githubResponse.data && slackResponse.data.channels) {
        setRepositories(githubResponse.data);
        setSlackChannels(slackResponse.data.channels);
      } else {
        console.error("Error fetching data");
        return;
      }
    } catch (error) {
      console.error("Error fetching repositories:", error);
    }
    setIsAddRepoModalOpen(true);
  };

  const handleSaveRepository = async () => {
    if (selectedRepo && selectedChannel) {
      const repoData = repositories.find((repo) => repo.id === selectedRepo);
      const channelData = slackChannels.find(
        (channel) => channel.id === selectedChannel
      );
      const linkRepo = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/github/connect-repo`,
        {
          repoId: repoData.id,
          channelId: channelData.id,
        },
        {
          headers: {
            "x-auth-token": localStorage.getItem("access_Token") ?? "",
          },
        }
      );
      if (!linkRepo.data.success) {
        console.error("Error linking repository:", linkRepo.data.message);
        return;
      }
      setRepositories((prev) => [
        ...prev,
        {
          id: repoData.id,
          name: repoData.name,
          description: repoData.description,
          private: repoData.private,
          channel: channelData.name,
          status: "active",
        },
      ]);
      setIsAddRepoModalOpen(false);
      setSelectedRepo("");
      setSelectedChannel("");
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const isUserLoggedIn = localStorage.getItem("access_Token");
        if (!isUserLoggedIn) {
          window.location.href = "/";
        }
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/user/my`,
          {
            headers: {
              "x-auth-token": localStorage.getItem("access_Token") ?? "",
            },
          }
        );
        setIsSlackConnected(response.data.user.slack?.connected || false);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-white/10 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-button-gradient rounded-lg flex items-center justify-center">
                <Bell className="w-4 h-4 text-white" />
              </div>
              <h1 className="text-xl font-bold">Pulsar Dashboard</h1>
            </div>

            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
              <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                <Github className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {/* Welcome Section */}
          <motion.div variants={itemVariants}>
            <h2 className="text-3xl font-bold mb-2">Welcome back!</h2>
            <p className="text-muted-foreground">
              Manage your notification settings and monitor your repositories.
            </p>
          </motion.div>

          {/* Connection Status */}
          <motion.div
            variants={itemVariants}
            className="grid md:grid-cols-2 gap-6"
          >
            {/* Slack Connection */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Slack className="w-5 h-5 text-electric-blue" />
                  <span>Slack Integration</span>
                </CardTitle>
                <CardDescription>
                  Connect your Slack workspace to receive notifications
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isSlackConnected ? (
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="text-sm font-medium">
                        Connected to Workspace
                      </span>
                    </div>
                    <Badge
                      variant="secondary"
                      className="bg-green-500/10 text-green-500 border-green-500/20"
                    >
                      Active
                    </Badge>
                  </div>
                ) : (
                  <Button
                    onClick={handleConnectSlack}
                    className="w-full btn-hero"
                  >
                    <Slack className="w-4 h-4 mr-2" />
                    Connect Slack
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* GitHub Status */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Github className="w-5 h-5" />
                  <span>GitHub Integration</span>
                </CardTitle>
                <CardDescription>
                  Your GitHub account is connected and ready
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-sm font-medium">
                      Connected as @developer
                    </span>
                  </div>
                  <Badge
                    variant="secondary"
                    className="bg-green-500/10 text-green-500 border-green-500/20"
                  >
                    Active
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Repositories Section */}
          <motion.div variants={itemVariants}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold">Connected Repositories</h3>
                <p className="text-muted-foreground">
                  Monitor builds and deployments for your projects
                </p>
              </div>

              {isSlackConnected && (
                <Dialog
                  open={isAddRepoModalOpen}
                  onOpenChange={setIsAddRepoModalOpen}
                >
                  <DialogTrigger asChild>
                    <Button onClick={handleAddRepository} className="btn-hero">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Repository
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px] glass-card border-white/20">
                    <DialogHeader>
                      <DialogTitle className="flex items-center space-x-2">
                        <Github className="w-5 h-5" />
                        <span>Add GitHub Repository</span>
                      </DialogTitle>
                      <DialogDescription>
                        Select a repository and choose which Slack channel
                        should receive notifications.
                      </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-6 py-4">
                      {/* Repository Selection */}
                      <div className="space-y-2">
                        <Label
                          htmlFor="repository"
                          className="text-sm font-medium"
                        >
                          Select Repository
                        </Label>
                        <Select
                          value={selectedRepo}
                          onValueChange={setSelectedRepo}
                        >
                          <SelectTrigger className="w-full bg-background/50 border-white/20">
                            <SelectValue placeholder="Choose a repository..." />
                          </SelectTrigger>
                          <SelectContent className="bg-card border-white/20">
                            {repositories.map((repo) => (
                              <SelectItem
                                key={repo.id}
                                value={repo.id}
                                className="focus:bg-muted"
                              >
                                <div className="flex items-center space-x-2">
                                  <Github className="w-4 h-4" />
                                  <div className="flex-1">
                                    <div className="flex items-center space-x-2">
                                      <span className="font-medium">
                                        {repo.name}
                                      </span>
                                      {repo.private && (
                                        <Badge
                                          variant="secondary"
                                          className="text-xs"
                                        >
                                          Private
                                        </Badge>
                                      )}
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                      {repo.description}
                                    </p>
                                  </div>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Channel Selection */}
                      <div className="space-y-2">
                        <Label
                          htmlFor="channel"
                          className="text-sm font-medium"
                        >
                          Slack Channel
                        </Label>
                        <Select
                          value={selectedChannel}
                          onValueChange={setSelectedChannel}
                        >
                          <SelectTrigger className="w-full bg-background/50 border-white/20">
                            <SelectValue placeholder="Choose a channel..." />
                          </SelectTrigger>
                          <SelectContent className="bg-card border-white/20">
                            {slackChannels.map((channel) => (
                              <SelectItem
                                key={channel.id}
                                value={channel.id}
                                className="focus:bg-muted"
                              >
                                <div className="flex items-center space-x-2">
                                  <Slack className="w-4 h-4 text-electric-blue" />
                                  <span>{channel.name}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Preview */}
                      {selectedRepo && selectedChannel && (
                        <div className="p-4 bg-secondary/30 rounded-lg border border-white/10">
                          <p className="text-sm text-muted-foreground mb-2">
                            Preview:
                          </p>
                          <div className="flex items-center space-x-2 text-sm">
                            <Github className="w-4 h-4" />
                            <span className="font-medium">
                              {
                                repositories.find((r) => r.id === selectedRepo)
                                  ?.name
                              }
                            </span>
                            <span className="text-muted-foreground">→</span>
                            <Slack className="w-4 h-4 text-electric-blue" />
                            <span className="font-medium">
                              {
                                slackChannels.find(
                                  (c) => c.id === selectedChannel
                                )?.name
                              }
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex justify-end space-x-3">
                      <Button
                        variant="outline"
                        onClick={() => setIsAddRepoModalOpen(false)}
                        className="border-white/20"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleSaveRepository}
                        disabled={!selectedRepo || !selectedChannel}
                        className="btn-hero"
                      >
                        Add Repository
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </div>

            {!isSlackConnected ? (
              <Card className="glass-card">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Slack className="w-12 h-12 text-muted-foreground mb-4" />
                  <h4 className="text-lg font-semibold mb-2">
                    Connect Slack First
                  </h4>
                  <p className="text-muted-foreground text-center mb-6">
                    You need to connect your Slack workspace before adding
                    repositories
                  </p>
                  <Button onClick={handleConnectSlack} className="btn-hero">
                    <Slack className="w-4 h-4 mr-2" />
                    Connect Slack
                  </Button>
                </CardContent>
              </Card>
            ) : repositories.length === 0 ? (
              <Card className="glass-card">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <GitBranch className="w-12 h-12 text-muted-foreground mb-4" />
                  <h4 className="text-lg font-semibold mb-2">
                    No Repositories Added
                  </h4>
                  <p className="text-muted-foreground text-center mb-6">
                    Add your GitHub repositories to start receiving build
                    notifications
                  </p>
                  <Dialog
                    open={isAddRepoModalOpen}
                    onOpenChange={setIsAddRepoModalOpen}
                  >
                    <DialogTrigger asChild>
                      <Button
                        onClick={handleAddRepository}
                        className="btn-hero"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Your First Repository
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px] glass-card border-white/20">
                      <DialogHeader>
                        <DialogTitle className="flex items-center space-x-2">
                          <Github className="w-5 h-5" />
                          <span>Add GitHub Repository</span>
                        </DialogTitle>
                        <DialogDescription>
                          Select a repository and choose which Slack channel
                          should receive notifications.
                        </DialogDescription>
                      </DialogHeader>

                      <div className="space-y-6 py-4">
                        {/* Repository Selection */}
                        <div className="space-y-2">
                          <Label
                            htmlFor="repository"
                            className="text-sm font-medium"
                          >
                            Select Repository
                          </Label>
                          <Select
                            value={selectedRepo}
                            onValueChange={setSelectedRepo}
                          >
                            <SelectTrigger className="w-full bg-background/50 border-white/20">
                              <SelectValue placeholder="Choose a repository..." />
                            </SelectTrigger>
                            <SelectContent className="bg-card border-white/20">
                              {repositories.map((repo) => (
                                <SelectItem
                                  key={repo.id}
                                  value={repo.id}
                                  className="focus:bg-muted"
                                >
                                  <div className="flex items-center space-x-2">
                                    <Github className="w-4 h-4" />
                                    <div className="flex-1">
                                      <div className="flex items-center space-x-2">
                                        <span className="font-medium">
                                          {repo.name}
                                        </span>
                                        {repo.private && (
                                          <Badge
                                            variant="secondary"
                                            className="text-xs"
                                          >
                                            Private
                                          </Badge>
                                        )}
                                      </div>
                                      <p className="text-xs text-muted-foreground">
                                        {repo.description}
                                      </p>
                                    </div>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Channel Selection */}
                        <div className="space-y-2">
                          <Label
                            htmlFor="channel"
                            className="text-sm font-medium"
                          >
                            Slack Channel
                          </Label>
                          <Select
                            value={selectedChannel}
                            onValueChange={setSelectedChannel}
                          >
                            <SelectTrigger className="w-full bg-background/50 border-white/20">
                              <SelectValue placeholder="Choose a channel..." />
                            </SelectTrigger>
                            <SelectContent className="bg-card border-white/20">
                              {slackChannels.map((channel) => (
                                <SelectItem
                                  key={channel.id}
                                  value={channel.id}
                                  className="focus:bg-muted"
                                >
                                  <div className="flex items-center space-x-2">
                                    <Slack className="w-4 h-4 text-electric-blue" />
                                    <span>{channel.name}</span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Preview */}
                        {selectedRepo && selectedChannel && (
                          <div className="p-4 bg-secondary/30 rounded-lg border border-white/10">
                            <p className="text-sm text-muted-foreground mb-2">
                              Preview:
                            </p>
                            <div className="flex items-center space-x-2 text-sm">
                              <Github className="w-4 h-4" />
                              <span className="font-medium">
                                {
                                  repositories.find(
                                    (r) => r.id === selectedRepo
                                  )?.name
                                }
                              </span>
                              <span className="text-muted-foreground">→</span>
                              <Slack className="w-4 h-4 text-electric-blue" />
                              <span className="font-medium">
                                {
                                  slackChannels.find(
                                    (c) => c.id == selectedChannel
                                  )?.name
                                }
                              </span>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex justify-end space-x-3">
                        <Button
                          variant="outline"
                          onClick={() => setIsAddRepoModalOpen(false)}
                          className="border-white/20"
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={handleSaveRepository}
                          disabled={!selectedRepo || !selectedChannel}
                          className="btn-hero"
                        >
                          Add Repository
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {repositories.map((repo) => (
                  <Card key={repo.id} className="glass-card">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <Github className="w-5 h-5" />
                          <div>
                            <h4 className="font-semibold">{repo.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              Last build: {repo.lastBuild}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-4">
                          <div className="text-sm">
                            <span className="text-muted-foreground">
                              Channel:{" "}
                            </span>
                            <span className="font-medium">{repo.channel}</span>
                          </div>

                          <Badge
                            variant={
                              repo.status === "success"
                                ? "default"
                                : repo.status === "failed"
                                ? "destructive"
                                : "secondary"
                            }
                            className={
                              repo.status === "success"
                                ? "bg-green-500/10 text-green-500 border-green-500/20"
                                : repo.status === "failed"
                                ? "bg-red-500/10 text-red-500 border-red-500/20"
                                : "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                            }
                          >
                            {repo.status}
                          </Badge>

                          <Button variant="ghost" size="sm">
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
};

export default Dashboard;
